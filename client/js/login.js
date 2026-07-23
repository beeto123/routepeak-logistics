const form=document.getElementById("loginForm");

form.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("email").value;

const password=document.getElementById("password").value;

const response=await fetch("/api/admin/login",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

});

const data=await response.json();

if(data.success){

localStorage.setItem("token",data.token);

window.location.href="dashboard.html";

}else{

document.getElementById("loginMessage").innerHTML=data.message;

}

});