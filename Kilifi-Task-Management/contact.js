function message() {
    var name= document.getElementById('name');
    var email= document.getElementById('email');
    var number= document.getElementById('number');
    var msg= document.getElementById('msg');
  
    if (name.value === ''|| email.value === ''||number.value === ''||msg.value === '') {
      danger.style.display = "block";
    }
    else{
      setTimeout(()=>
      {
        name.value = '';
        email.value = '';
        number.value = '';
        msg.value = '';
      },2000);
       success.style.display = "block";
    }
  }