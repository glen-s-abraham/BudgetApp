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
        }
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
            console.log(newItem);
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
			var value=document.querySelector('.add__value').value;
			//grouping inputs into an object to send as a whole
			return{
				type:type,
				descreption:descreption,
				value:value
			}
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

function setBudget(){
	
	
	//1.get inputs from ui
	var inputs=uiCntrl.getUIData();
	//2.send inputs to budgetcontrol
	bdgtCntr.addData(inputs.type,inputs.descreption,inputs.value);
	//3.calculate expense
	//4.refresh ui

}

//public function to access setEventListeners()
return{
	init:function(){
		setEventListeners();
	}
}


	
}
)(budgetController,UIController);

controller.init();
