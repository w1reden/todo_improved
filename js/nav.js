import calendarPanel from './calendar-panel';
import usercardPanel from './usercard-panel';
import chartsPanel from './charts-panel';

export default function() {
  let items = $('.main-nav li'),
  activeItemClass = 'sidebar-item-active';

  let panels = {
    user: usercardPanel,
    calendar: calendarPanel,
    search: undefined,
    filter: undefined,
    charts: chartsPanel,
    settings: undefined,
  };


  /********************************
  * INIT
  ********************************/
  bindEvents();

  function bindEvents() {

    items.click(function(e) {
      let el = $(e.target);
      if(el.hasClass('fa')) el = el.parent();

      let panel = panels[el.attr('id')]();

      if(el.hasClass(activeItemClass)) {
        items.removeClass(activeItemClass);
        panel.hide();
        return;
      } else {
        items.removeClass(activeItemClass);
        el.addClass(activeItemClass);
        panel.show();
        return;
      }
    });

  };

};