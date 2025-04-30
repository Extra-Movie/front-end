import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
import {loginUser} from './../../Types/Authentication.types';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {
  constructor(private  router:Router){}
  ngOnInit(): void {
    this.timerFunc();

  }

  //value to check email status
  remberMeStatus :boolean = false ;
  loginValidStatus : boolean = true ;
  //change this to true to remove inital test of timer 
  passwordStatusFlag:boolean = false ;
  emailStatusFlag:boolean = true ;
  timerCounter : number = 3 ;



  //form login
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_.]{3,}@[a-zA-Z]{3,}.[a-zA-Z]{3,}$/)]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/), Validators.minLength(8),Validators.maxLength(30)]),
  });

  //function to start counter for 5 seconds to displat issue to user
  timerFunc()
  {
    let counter = 0 ;
    let that = this ;
    let timerRet = setInterval(function(){
      counter++ ;
      if(counter===that.timerCounter)
      {
        that.passwordStatusFlag = true ;
        that.emailStatusFlag = true ;
        that.loginValidStatus = true ;
        clearInterval(timerRet);
      }
    },1000);
  }



  //login function
  loginFun()
  {
    this.timerFunc();
    //first check form Validation
    if(this.loginForm.valid)
    {
      this.loginValidStatus = true ;

      //first check if the email is found in the DB

          //if found in DB check if email password mathes

              //user authenicated
                  //determine type of user (admin / normal)

                      //normal direct to home

                      //admin direct to dashboard

                  //also check for remember me flag to save email for future usage

          //password not matching >> set flag to produce wrong password to UI


      // not found >> set flag to produce email not exist to UI


    }
    else
    {
      this.loginValidStatus = false ;
    }
  }

  //remember Function to chack status of remember me
  rememberFun(checkRem:any)
  {
    console.log(checkRem);
    if(checkRem.checked)
    {
      this.remberMeStatus = true ;
    }
    else
    {
      this.remberMeStatus = false ;
    }

  }

}
