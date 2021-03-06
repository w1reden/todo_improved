<template>
  
  <sortbar @key-changed="changeKey"></sortbar>

  <div class="tasklist-global" v-if="tasksShow" v-click-outside v-drag-selectable>
    <div v-for="task in sortedTasks" transition="sort">
      <task @task-remove="removeTask(task)"
            @task-update="updateTask(task)"
            @task-complete="completeTask(task)"
            :task="task"
            :show-delay="(100 * $index) / 2"
            :event-bus="eventBus">
      </task>
    </div>
  </div> 
  
  <context-menu :event-bus="eventBus"></context-menu>

  <builder @task-composed="saveTask" :event-bus="eventBus"></builder>

</template>

<script>
  import taskComponent from './task.vue';
  import sortbar from './sortbar.vue';
  import contextMenu from './context.vue';
  import builder from './builder.vue';
  import clickOutsideDirective from '../../directives/click-outside.js';
  import dragSelectableDirective from '../../directives/drag-selectable.js';
  import _ from '_';
  import * as TaskService from '../../services/task-service.js';

  export default {
    props: ['eventBus'],

    components: {
      'task': taskComponent,
      'sortbar': sortbar,
      'context-menu': contextMenu,
      'builder': builder,
    },
    
    directives: {
      'click-outside': clickOutsideDirective,
      'drag-selectable': dragSelectableDirective,
    },

    data: function() {
      return {
        tasks: [],
        tasksShow: false,
        key: {},
        multipleSelection: false,
        selectedTasks: [],
      };
    },

    methods: {
      removeTask: function(vm) {
        TaskService.remove(vm)
          .then(() => {
            this.tasks.$remove(vm);
          })
          .catch(err => {
            if (err) throw err;
          });
      },

      updateTask: function(task) {
        TaskService.update(task)
          .catch(err => {
            if (err) throw err;
          })
      },

      completeTask: function(task) {
        TaskService.complete(task)
          .catch(err => {
            if (err) throw err;
          })
      },

      changeKey: function(key) {
        this.key = key;
      },

      saveTask: function(task) {
        TaskService.create(task)
          .then(() => {
            return TaskService.getCurrent();
          })
          .then(res => {
            this.tasks = res.tasks;
          })
          .catch(err => {
            if (err) throw err;
          });
      },

      getTaskViewModel(_id) {
        return this.$children.find(vm => {
          if (vm.$get('task._id')) {
            return _id == vm.$get('task._id');
          }
        })
      },

      expandSelection: function(_id, outOfTurn = false) {
        let index;

        const vm = this.getTaskViewModel(_id);
        const task = vm.$get('task');
        const tasks = this.selectedTasks;

        this.multipleSelection = true;
        
        if (!tasks.includes(task)) {
          tasks.push(task)
          vm.$set('checked', true);
        } else {

          tasks.find(({ _id }, i) => {
            return _id == task._id
              ? (true, index = i)
              : false
          })

          if (index < tasks.length - 1) {
            this.getTaskViewModel([...tasks].pop()._id)
              .$set('checked', false);

            tasks.length--;
          }
        }

        if (outOfTurn) {
          this.eventBus.$emit('multiple-selection', tasks, outOfTurn);
        } else {
          this.eventBus.$emit('multiple-selection', tasks);
        }
      },

      dropSelection: function() {
        this.multipleSelection = false;
        this.selectedTasks = [];
      },

      getSelection: function() {
        return this.selectedTasks;
      },

      bindEvents: function() {
        this.$on('collapse-me', () => {
          if (!this.multipleSelection) {
            this.eventBus.$emit('task-unfocus');
          }
        });
      },
    },

    computed: {
      sortedTasks: function() {
        let iteratees = {};

        const _default = { key: ['date'], option: ['asc'] };

        switch(this.key.name) {
          case 'date':
            iteratees = _default; break;
          case 'priority':
            iteratees = { key: ['priority'], option: ['desc'] }; break;
          case 'length':
            iteratees = { key: (task) => task.text.length, option: ['desc'] }; break;
          case 'alphabet':
            iteratees = { key: ['text'], option: ['asc'] }; break;
          default: iteratees = _default;
        }

        return _.orderBy(this.tasks, iteratees.key, iteratees.option);
      }
    },

    created: function() {
      //to achieve init transition
      setTimeout(() => this.tasksShow = true, 50);
      
      TaskService.getCurrent()
        .then(res => {
          this.tasks = res.tasks;
        })
        .catch(err => {
          if(err) throw err;
        })


      this.bindEvents();
    },
  }

</script>
