var BudgetController=(function(){
    
    var Expense= function(id, descrption, value){
        this.id=id;
        this.description=descrption;
        this.value= value;
        this.percentage=-1;
    };
    Expense.prototype.calcPercentage= function(tincome){
        if(tincome>0){
            this.percentage= Math.round((this.value*100/tincome));  
        }
        else{
            this.percentage=-1;
        }
    };
    Expense.prototype.getPercentage= function(){
        return this.percentage; 
    };
    
    var Income= function(id, descrption, value){
        this.id=id;
        this.description=descrption;
        this.value= value;
    };
    
    var calculateTotal= function(type){
        var sum= 0;
        data.allItems[type].forEach(function(current){
            sum+= current.value;
        })
        data.totals[type]=sum;
    };
    
    var data={
        allItems:{
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        }, 
        budget:0,
        percentage: -1
    };
    
    return{
      addItem : function(type, desc, val){
          var newItem, ID;
          
          //creating new ID
          if(data.allItems[type].length ===0){
              ID=0;
          }
          else{
              ID=data.allItems[type][data.allItems[type].length - 1].id + 1;
          }
          //create new 
          if(type==='exp'){
              newItem=new Expense(ID, desc, val);
          }
          else{
              newItem=new Income(ID, desc, val);
          }
          
          //pushing new Item into the array
          data.allItems[type].push(newItem);
          
          //returning new element
          return newItem;
      },
    
     deleteItem: function(type, id){
         var ids, index;
         ids=data.allItems[type].map(function(current){
             return current.id;
         })
         index= ids.indexOf(id);
         if(index!==-1){
             data.allItems[type].splice(id,1);
         }
     },
       
        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');
            
            data.budget= data.totals.inc - data.totals.exp;
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp*100)/data.totals.inc);
            }
            else{
                data.percentage=-1;
            }
        }, 
        calculatePercentage: function(){
            data.allItems.exp.forEach(function(current){
               current.calcPercentage(data.totals.inc);
            });

        },
                        
        getPercentages: function(){
            var allPerc= data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPerc;
            
        },
            
        
        getBudget: function(){
            return{
                budget: data.budget,
                percentage: data.percentage,
                tincome: data.totals.inc,
                texpenses: data.totals.exp
            };
        }
    };
        
    
})();




var uiController=(function(){
    
    var DOMstrings={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetlabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage',
        Month: '.budget__title--month'
    };
    
    var formatNumber= function(type, num){
            var numSplit, int, dec;
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split('.');
            int =numSplit[0];
            if(int.length>3){
                int= int.substr(0,int.length-3)+ ',' + int.substr(int.length-3,3);
            }
            dec=numSplit[1];
            return (type==='exp'? '-':'+')+' '+ int + '.'+  dec;
    };
    
    var nodeListForEach = function(list, callback){
                for(var i=0;i<list.length;i++){
                    callback(list[i], i);
                }
    };
    
    
    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        getDOMstrings: function(){
            return DOMstrings;
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            if(type==='inc'){
                element= DOMstrings.incomeContainer;
                html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else{
                element=DOMstrings.expensesContainer;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml= html.replace('%id%', obj.id);
            newHtml= newHtml.replace('%desc%', obj.description);
            newHtml= newHtml.replace('%value%', formatNumber(type, obj.value));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        deleteListItem: function(selectorID){
            var el= document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array){
                current.value="";
            })
            fieldsArr[0].focus();
             
        },
        
        displayBudget: function(obj){
            var type= obj.budget>0?'inc':'exp';
            
            document.querySelector(DOMstrings.budgetlabel).textContent= formatNumber(type,obj.budget);
            document.querySelector(DOMstrings.incomeLabel).textContent= formatNumber('inc',obj.tincome);
            document.querySelector(DOMstrings.expensesLabel).textContent= formatNumber('exp',obj.texpenses);
            if(obj.percentage>0){
                    document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage + '%';
            }
            else{
                    document.querySelector(DOMstrings.percentageLabel).textContent= '--';

            }
        },
        displayMonth: function(){
            var now=new Date();
            var month= now.getMonth();
            var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            var year= now.getFullYear();
            document.querySelector(DOMstrings.Month).textContent=months[month]+ ' '+ year;
        },
        
        changedType: function(){
            var fields= document.querySelectorAll(
                DOMstrings.inputType+ ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
             nodeListForEach(fields, function(current){
                 current.classList.toggle('red-focus');
             });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
            
        },
        
        
        displayPercentage: function(percentages){
            var fields= document.querySelectorAll(DOMstrings.expensePercLabel);
            nodeListForEach(fields, function(current, index){
                if(percentages[index]>0)
                    current.textContent=percentages[index]+ '%';
                else{
                    current.textContent='--';
                }
            })
        }
    };
    
    
    
})();




var controller=(function(bCtrl, uiCtrl){
    
    var setupEventListeners= function(){
        var DOM = uiCtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode===13||event.which===13){
                ctrlAddItem();
            }
        });   
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
    }
    
    var updateBudget= function(){
        
        //1.Calculate the budget
        bCtrl.calculateBudget();
        
        //2.Returns the budget
        var budget= bCtrl.getBudget();
        
        //3.Add Budget to the UI
        uiCtrl.displayBudget(budget);
    }
    
    var updatePercentages= function(){
        //1.Calculate percentages
        bCtrl.calculatePercentage();
        var percentages = bCtrl.getPercentages();
        uiCtrl.displayPercentage(percentages);
    }
    
    var ctrlAddItem=function(){
        
        //1. Getting input
        var input= uiCtrl.getInput();
        if(input.description!==""&&!isNaN(input.value)&&input.value>0){
            //2. adding data to data to budget controller
            var newItem= bCtrl.addItem(input.type, input.description, input.value);
        
            //3.Add item to the UI
            uiCtrl.addListItem(newItem, input.type);
        
            //clearing the fields
            uiCtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
        
        
    }
    
    var ctrlDeleteItem= function(event){
        var itemID, splitID, type, ID;
        itemID= event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID= itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            
            //1.Delete from the data structure
            bCtrl.deleteItem(type, ID);
            
            //2.Delete from the UI
            uiCtrl.deleteListItem(itemID);
            
            //3.Reflect in the budget
            updateBudget();
            updatePercentages();
        }
    }
    
    return {
        init: function(){
            //console.log('Started:');
            uiCtrl.displayMonth();
            setupEventListeners();
        }
    }
    
    
    
})(BudgetController, uiController);

controller.init();
