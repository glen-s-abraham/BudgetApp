//Budget Controller
var budgetController=(function(){
	//expense datao bject
	var Expense=function(id,descreption,value){
		this.id=id;
		this.descreption=descreption;
		this.value=value;
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
        }
    	
     }

    }
	



)();

//UI Controller
var UIController=(function(){

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
				html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%descreption%</div><div class="right clearfix"<div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}else if(type==='inc'){
				container=document.querySelector('.income__list');
				html='<div class="item clearfix" id="income-%id%"><div class="item__description">%descreption%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
			
			newhtml=html.replace('%id%',obj.id);
			newhtml=newhtml.replace('%descreption%',obj.descreption);
			newhtml=newhtml.replace('%value%',obj.value);
			container.insertAdjacentHTML('beforeend', newhtml);

		},

		clearFields:function(){
			fields=document.querySelectorAll('.add__description,.add__value');
			fieldsArr=Array.prototype.slice.call(fields);
			console.log(fieldsArr);
			fieldsArr.forEach(function(item,index){
				item.value="";
			});


		},
		setUIBudget:function(obj){
			document.querySelector('.budget__value').textContent=obj.budget;
			document.querySelector('.budget__income--value').textContent=obj.inc;
			document.querySelector('.budget__expenses--value').textContent=obj.exp;
			if(obj.percent>0)
				document.querySelector('.budget__expenses--percentage').textContent=obj.percent+"%";
			else
				document.querySelector('.budget__expenses--percentage').textContent='---';


		}

	}
	
}
)();

//Global Controller

var controller=(function(bdgtCntr,uiCntrl){

//function to start event listener
function setEventListeners(){
	document.querySelector('.add__btn').addEventListener('click',function(){
	console.log('button clicked');
	setBudget();

});

document.addEventListener('keypress',function(event){	
	if(event.key==='Enter'||event.code==='Enter'){
		console.log('key pressed');
		setBudget();
	}
});

}
function updatBudgetData(){
	//1.update budget
	bdgtCntr.updateBudget();
}

function setUIBudget(){
	var bdgt=bdgtCntr.getBudget();
	console.log(bdgt);
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

	}
}


	
}
)(budgetController,UIController);

controller.init();
