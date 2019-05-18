/*--setting up the modules---*/
var converterController = (function() {
  var usd = function(value) {
    this.value = value;
  };
  var bit = function(value) {
    this.value = value;
  };
  var getValue = function(type) {
    var totals;
    data.allItems[type].forEach(current => {
      totals = current.value;
    });
    data.totals[type] = totals;
  };
  var data = {
    allItems: {
      usd: [],
      bit: []
    },
    totals: {
      usd: 0,
      bit: 0
    },
    converted: 0
  };

  return {
    getInput: function(value, type) {
      var item;
      if (type === 'usd') {
        item = new usd(value);
      } else if (type === 'bit') {
        item = new bit(value);
      }
      data.allItems[type].push(item);
      return item;
    },
    calculateValue: function(type) {
      getValue('bit');
      getValue('usd');

      if (type === 'usd') {
        data.converted = Math.round(data.totals['usd'] * 0.0001375803);
      } else if (type === 'bit') {
        data.converted = `$ ${Math.round(data.totals['bit'] * 7268.48)}`;
      }
    },
    displayValue: function() {
      return {
        convertedValue: data.converted
      };
    },
    testing: function() {
      console.log(data);
    }
  };
})();
//UI
var UIController = (function() {
  var DOMStrings = {
    total: '.budget__income--value',
    value: '.add__value',
    type: '.add__type',
    btn: '.add__btn'
  };
  return {
    getInput: function() {
      return {
        value: parseFloat(document.querySelector(DOMStrings.value).value),
        type: document.querySelector(DOMStrings.type).value
      };
    },
    displayValue: function(val) {
      document.querySelector(DOMStrings.total).textContent = `${val}`;
    },
    getDOMElements: function() {
      return DOMStrings;
    }
  };
})();
//Global controller
var controller = (function(conveterCtrl, UICtrl) {
  var setUpEventListeners = function() {
    var DOM = UICtrl.getDOMElements();
    document.querySelector(DOM.btn).addEventListener('click', addItem);
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        addItem(e);
      }
    });
  };

  var addItem = function(e) {
    e.preventDefault();
    //1. Get the input data
    var input = UICtrl.getInput();
    //2. Pass it to the converter controller
    conveterCtrl.getInput(input.value, input.type);
    //3. Calculate it
    conveterCtrl.calculateValue(input.type);
    //4. Update the UI
    var convertedValue = conveterCtrl.displayValue();
    UICtrl.displayValue(convertedValue.convertedValue);
  };

  return {
    init: function() {
      console.log('Application has started');
      setUpEventListeners();
      UICtrl.displayValue(0);
    }
  };
})(converterController, UIController);
controller.init();
