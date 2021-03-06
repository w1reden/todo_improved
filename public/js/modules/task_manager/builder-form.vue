<template>
  <div class="b-form-wrap" @click="slideUp()" :class="{'b-form-collapsed': isCollapsed}" v-click-outside> 

    <div class="b-form-tip">
      <i class="fa fa-pencil"></i>
    </div>
    
    <div class="form-unit">
      <div class="form-unit-top">
        <div class="unit-description">Task description</div>
        <div class="unit-counter">Characters: {{description.length}}/<u>{{max}}</u></div>
      </div>
      <div class="b-textfield-wrap">

        <div v-show="folders.dropdown"
             v-click-outside="folders-dropdown"
             transition="dropdown"
             class="b-form-dropdown">
          <ul>
            <li v-for="folder in folders.list | filterBy folders.search"
                v-on:click="setFolder(folder._id)"
                v-bind:class="{ 'b-form-folder-focused': folders.focused == $index }">
              <i class="fa fa-fw fa-folder" style="color: {{folder.color}};"></i>
              <span>{{folder.hint}}</span>
            </li>
          </ul>
        </div>

        <div contenteditable
             class="b-form-textfield"
             v-editable-model:max="description"
             v-folders-list:#="folders.current"
             v-priority:$="priorities.current"
             v-placeholder="Example: Do some house cleaning every saturday morning">
        </div>

      </div>
    </div>

    <div class="b-form-footer">
      <div class="b-form-controls">

        <div v-show="priorities.dropdown" v-click-outside="priorities-dropdown" class="b-priority-list" transition="dropdown">
          <i class="fa fa-flag tl-priority-{{val}}"
             v-for="val of priorities.list"
             @click="setPriority(val)">
          </i>
        </div>

        <i data-except="priorities-dropdown" class="fa fa-fw fa-flag{{ priorities.current == null ? '-o' : '' }} tl-priority-{{priorities.current}}"
           @click="togglePrioritiesDropdown()">
        </i>

        <i data-except="folders-dropdown" class="fa fa-fw fa-folder{{ folders.current ? '' : '-o' }}"
           @click="toggleFoldersDropdown()"
           style="color: {{folders.current.color}};">
          <span class="b-hint hover-hint">Set folder</span>
        </i>

      </div>

      <button @click="save()" class="b-save-btn">Save task</button>
    </div>
  </div>
</template>

<script>

  import clickOutsideDirective from '../../directives/click-outside.js';
  import placeholderDirective from '../../directives/placeholder.js';
  import editableModel from '../../directives/editable-model.js';
  import foldersList from '../../directives/folders-list.js';
  import priorityKey from '../../directives/priority-key.js';
  import * as FolderService from '../../services/folder-service.js';

  export default {
    props: ['deadline'],

    directives: {
      'editable-model': editableModel,
      'placeholder': placeholderDirective,
      'click-outside': clickOutsideDirective,
      'folders-list': foldersList,
      'priority': priorityKey
    },

    data: function() {
      return {
        max: 130,
        description: '',

        priorities: {
          dropdown: false, // show / hide
          current: null,
          list: [0, 1, 2], // allowed values
        },

        folders: {
          dropdown: false, // show / hide
          current: null,
          search: '',
          focused: null,
          list: [],
        },

        isCollapsed: true,
      };
    },

    methods: {
      setFolder: function(_id) {
        let folder = this.folders.list.filter(e => e._id == _id)[0];
        this.folders.current = folder;
        this.folders.focused = null;
        this.hideFoldersDropdown();
      },

      setPriority: function(value) {
        this.priorities.current = value;
        this.hidePrioritiesDropdown();
      },

      togglePrioritiesDropdown() { this.priorities.dropdown = !this.priorities.dropdown; },

      hidePrioritiesDropdown() { this.priorities.dropdown = false; },

      toggleFoldersDropdown() { this.folders.dropdown = !this.folders.dropdown; },

      hideFoldersDropdown() { this.folders.dropdown = false; },

      slideDown: function() {
        this.isCollapsed = true;
        this.$emit('down');
      },

      slideUp: function() {
        this.isCollapsed = false;
        this.$emit('up');
      },

      save: function() {

        let task = {
          text: this.description,
          priority: this.priorities.current,
          folder: this.folders.current,
          date: this.deadline,
        };

        this.$emit('save', task);

        setTimeout(() => this.slideDown(), 0);
      },

      bindEvents: function() {
        this.$on('collapse-me', () => this.slideDown());
        this.$on('folders-dropdown', () => this.hideFoldersDropdown());
        this.$on('priorities-dropdown', () => this.hidePrioritiesDropdown());
      },
    },

    created: function() {
      FolderService.all()
        .then(res => {
          this.folders.list = res.folders;
        })
        .catch(err => {
          if (err) throw err;
        })
    },

    ready: function() { this.bindEvents() }
  }
</script>

























