//Budget Controller
var budgetController=(function(){
	//expense datao bject
	var Expense=function(id,descreption,value){
		this.id=id;
		this.descreption=descreption;
		this.value=value;
		this.percent=-1;
	};
	Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
	Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
	var Income=function(id,descreption,value){
		this.id=id;
		this.descreption=descreption;
		this.value=value;
	};

	 var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget:0,
        percent:-1,
    };
    function totals(type){
    	data.totals[type]=0;
    	data.allItems[type].forEach(function(item){
    		data.totals[type]+=item.value;
    	});
    };
    
    return {
    	addData:function(type,desc,val){
    		var newItem,ID;
    		if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if(type==='exp'){
            	newItem=new Expense(ID,desc,val);
            }else if(type==='inc'){
            	newItem=new Income(ID,desc,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
             },
        updateBudget:function(){
        	totals('inc');
        	totals('exp');
        	data.budget=data.totals['inc']-data.totals['exp'];
        	if(data.totals['inc']>0){
        		data.percent=Math.round((data.totals['exp']/data.totals['inc'])*100);
        	}
        	data.budget=data.totals['inc']-data.totals['exp'];

        } ,   
        getBudget:function(){
        	return{
        		inc:data.totals['inc'],
        		exp:data.totals['exp'],
        		budget:data.budget,
        		percent:data.percent
        	}
        },
        deleteBudget:function(type,id){
        	ids=data.allItems[type].map(function(cur){
        		return cur.id;

        	});
        	index=ids.indexOf(id);
        	data.allItems[type].splice(index,1);
        },
        updatePercents:function(){
        	data.allItems.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc);
            });
        },
        getPercents:function(){
        	var totPercents=data.allItems.exp.map(function(cur) {
               return cur.getPercentage();
            });
            return totPercents;
        }
    	
     }

    }
	



)();

//UI Controller
var UIController=(function(){
	function formatNumber(num,type){

		var numSplit,dec,int;
		num=Math.abs(num);
		num=num.toFixed(2);

		numSplit=num.split('.');

		int=numSplit[0];
		dec=numSplit[1];


		if(int.length>3){
			
			int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
			
		}
		
		return (type==='inc'?'+':'-')+' '+int+'.'+dec;
	}

	return{
		//public function to return UI data
		getUIData:function(){
			var type=document.querySelector('.add__type').value;
			var descreption=document.querySelector('.add__description').value;
			var value=parseFloat(document.querySelector('.add__value').value);
			//grouping inputs into an object to send as a whole
			return{
				type:type,
				descreption:descreption,
				value:value
			}
		},
		setUIdata:function(obj,type){
			var html,newhtml,fields;
			if(type==='exp'){
				container=document.querySelector('.expenses__list');
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%descreption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}else if(type==='inc'){
				container=document.querySelector('.income__list');
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%descreption%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			newhtml=html.replace('%id%',obj.id);
			newhtml=newhtml.replace('%descreption%',obj.descreption);
			newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));
			container.insertAdjacentHTML('beforeend', newhtml);

		},

		clearFields:function(){
			fields=document.querySelectorAll('.add__description,.add__value');
			fieldsArr=Array.prototype.slice.call(fields);
			
			fieldsArr.forEach(function(item,index){
				item.value="";
			});


		},
		setUIBudget:function(obj){
			var type;
			obj.budget>0?type='inc':type='exp';
			document.querySelector('.budget__value').textContent=formatNumber(obj.budget,type);
			document.querySelector('.budget__income--value').textContent=formatNumber(obj.inc,'inc');
			document.querySelector('.budget__expenses--value').textContent=formatNumber(obj.exp,'exp');
			if(obj.percent>0)
				document.querySelector('.budget__expenses--percentage').textContent=obj.percent+"%";
			else
				document.querySelector('.budget__expenses--percentage').textContent='---';


		},
		deleteUIdata:function(elid){
			var element=document.getElementById(elid);
			element.parentNode.removeChild(element);

		},
		setDate:function(){
			date=new Date();
			month=date.getMonth();
			year=date.getFullYear();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			document.querySelector('.budget__title--month').textContent = months[month] + ' ' + year;

		},
		changedType: function() {
            var fields,fieldsArr;
            fields = document.querySelectorAll('.add__type,.add__description,.add__value');
            fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(cur){cur.classList.toggle('red-focus')});
                        
            document.querySelector('.add__btn').classList.toggle('red');
            
        },

	}
	
}
)();

//Global Controller

var controller=(function(bdgtCntr,uiCntrl){

//function to start event listener
function setEventListeners(){
	document.querySelector('.add__btn').addEventListener('click',function(){
	
	setBudget();

	

});

document.addEventListener('keypress',function(event){	
	if(event.key==='Enter'||event.code==='Enter'){
		
		setBudget();
	}
});

document.querySelector('.add__type').addEventListener('change',uiCntrl.changedType)
document.querySelector('.container').addEventListener('click',deleteBudget)


}
function updatBudgetData(){
	//1.update budget
	bdgtCntr.updateBudget();
}

function setUIBudget(){
	var bdgt=bdgtCntr.getBudget();
	
	uiCntrl.setUIBudget(bdgt);
}

function setBudget(){
	
	
	//1.get inputs from ui
	var inputs=uiCntrl.getUIData();
	//2.send inputs to budgetcontrol
	if(inputs.descreption!=="" && !isNaN(inputs.value)&&inputs.value!==0){
		var newItem=bdgtCntr.addData(inputs.type,inputs.descreption,inputs.value);
		uiCntrl.setUIdata(newItem,inputs.type);
		//3.clear input fields
		uiCntrl.clearFields();
		//call to update budget 
		updatBudgetData();
		
		//5.refresh ui
		

		setUIBudget();

		//6.update percentages
		bdgtCntr.updatePercents();


		//get percentages
		var percents=bdgtCntr.getPercents();
		



	}

	



}
function deleteBudget(event){
	
	itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
	if(itemId){
		splitId=itemId.split('-');
		console.log(splitId);
		bdgtCntr.deleteBudget(splitId[0],parseInt(splitId[1]));
		uiCntrl.deleteUIdata(itemId);
		updatBudgetData();
		setUIBudget();
		//6.update percentages
		bdgtCntr.updatePercents();


		//get percentages
		var percents=bdgtCntr.getPercents();
	}
}





//public function to access setEventListeners()
return{
	init:function(){
		setEventListeners();
		uiCntrl.setUIBudget(
		{
			inc:0,
			exp:0,
			budget:0,
			percent:-1

		}

		);
		uiCntrl.setDate();

	}
}


	
}
)(budgetController,UIController);

controller.init();
