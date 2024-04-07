let addToCart = document.querySelectorAll(".btn");
let cartCounter = document.querySelector(".cartCounter");


function updateCart(pizza){
    fetch("/update-cart",{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(pizza)
    }).then((response)=>{
         if(!response.ok){
            console.log("error")
         }
         return response.json()
    }).then(data =>{
     
        cartCounter.innerText=data.totalQty.totalQty;
       
      

    }).catch((err)=>{
        console.log(err);
    })


}



addToCart.forEach((btn)=>{
    btn.addEventListener("click",(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza)
        
    })
})

const alertMsg = document.getElementById('alert-msg');


if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove();
    },2000)
}
// admin code goes here 
function renderItems(items) {
    let parsedItems = Object.values(items)
    return parsedItems.map((menuItem) => {
        return `
            <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
        `
    }).join('')
  }




function generateMarkup(orders) {
    return orders.map(order => {
        return `
            <tr>
            <td class="border px-4 py-2 text-green-900">
                <p>${ order._id }</p>
                <div>${ renderItems(order.items) }</div>
            </td>
            <td class="border px-4 py-2">${ order.customerId.name }</td>
            <td class="border px-4 py-2">${ order.address }</td>
            <td class="border px-4 py-2">
                <div class="inline-block relative w-64">
                    <form action="/admin/orders/status" method="POST">
                        <input type="hidden" name="orderId" value="${ order._id }">
                        <select name="status" onchange="this.form.submit()"
                            class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="order_placed"
                                ${ order.status === 'order_placed' ? 'selected' : '' }>
                                Placed</option>
                            <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                Confirmed</option>
                            <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                Prepared</option>
                            <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                Delivered
                            </option>
                            <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                Completed
                            </option>
                        </select>
                    </form>
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <path
                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </td>
            <td class="border px-4 py-2">
                          ${order.createdAt}              
            </td>
        </tr>
    `
    }).join('')
}

const orderTableBody = document.querySelector('#orderTableBody')



let orders = []
let markup

async function fetchOrders() {
    try {
        const response = await fetch('/admin/orders', {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // Assuming generateMarkup and orderTableBody are defined elsewhere
        const markup = generateMarkup(data);
        orderTableBody.innerHTML = markup;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Call the function to fetch orders
fetchOrders();  

// dynamic class change logic
let statuses = document.querySelectorAll('.status-line');
let hiddenId = document.querySelector("#hiddenId");
let order  = hiddenId ? hiddenId.value:null;
order = JSON.parse(order);
let time = document.createElement('small');




function updateStatus(order){
// logic
statuses.forEach((status)=>{
    status.classList.remove('step-completed')
    status.classList.remove('current');
})
let stepCompleted = true;
statuses.forEach((status)=>{
    let dataProp = status.dataset.status;
    if(stepCompleted){
        status.classList.add("step-completed");
    }
    if(dataProp === order.status){
        stepCompleted=false;
        time.innerText = order.updatedAt;
        status.appendChild(time)
        if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current');
        }
    }
})



}

updateStatus(order)

let card  = null;  
let stripe =null;
function initStripe(){
    // Initialize Stripe
stripe = Stripe('pk_test_51OyOHKSFqY70DF9FQRNG9eBmSbVuxrf4Y4gnyN74l0aOl882wVIA3cUNGyQxnJfydarxFQY3L5q9CwNrIGHEIvnT00OFK2hvnF');

function mountWidget(){

 
let style = {
    base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
        color: '#aab7c4'
    }
    },
    invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
    }
};



const  elements  = stripe.elements();
card = elements.create('card',{style , hidePostalCode:true});

card.mount('#card-element');

}





    const paymentType = document.querySelector('#paymentType');
    if(!paymentType){
        return;
    }
    paymentType.addEventListener('change',(e)=>{
        console.log(e.target.value)
        if(e.target.value === "card"){
                            
            mountWidget();
        }else
        {
            card.destroy();
        }
    })
    


}
initStripe();










const paymentForm = document.querySelector('#payment-form');
if(paymentForm){
    paymentForm.addEventListener('submit',(e)=>{
    
        e.preventDefault();
        let formdata = new FormData(paymentForm);
        let formObject = {}
        for(let [key,value] of formdata.entries()){
            formObject[key]=value;
    
        }


        // verify card
         function placeOrder(formObject){
            fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json()
            })
            .then(data => {
                    
                  
                    window.location.href = '/orders';
               
            })
            .catch(error => {
               console.log(error)
            });
        
            // console.log(formObject)
    
        }





        if(!card){
            placeOrder(formObject);
            return;
        }
        
        
        stripe.createToken(card).then((result)=>{
         formObject.stripeToken = result.token.id;
         placeOrder(formObject);
          
        }).catch(err =>{
            console.log(err);
        })


        
    
})


}
