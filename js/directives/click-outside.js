export default {
  
  bind: function() {

    this.emitEvent = (e) => {
      this.vm.eventBus.$emit(this.expression);
    };

    this.stopPropagation = (e) => { 
      e.stopPropagation();
    }

    this.el.addEventListener('click', this.stopPropagation);

    document.body.addEventListener('click', this.emitEvent);
  },

  unbind: function() {
    this.el.removeEventListener('click', this.stopPropagation);
    document.body.removeEventListener('click',this.emitEvent);
  },

};