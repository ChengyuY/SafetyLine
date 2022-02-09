import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import { LoginService } from './login.service'
import { Router } from '@angular/router'
import { LoginForm } from "./login.type"
import { userAddForm} from "../utilisateur/user-add/user-add.type";
import {NzMessageService} from "ng-zorro-antd/message";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {Issue} from "../issue/issue.type";

// ng g c login

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private router: Router,
              private nzmsgService: NzMessageService,
              private userService: UtilisateurService) {
    this.userAddForm = this.fb.group({
      username: [''],
      email: [''],
      password: [''],
      checkPassword: [''],
      role: ['']
    })
  }

  loginForm!: FormGroup;

  submitForm(): void {
    const loginForm = this.loginForm;
    const{ controls } = loginForm;

    for (const i in controls) {
      if (controls.hasOwnProperty(i)) {
        controls[i].markAsDirty();
        // verifier les inputs ne sont pas vides
        controls[i].updateValueAndValidity();
        // changer la color des characteres
      }
    }

    if (!loginForm.valid){
      //console.log('Login failed!');
      return;
    }
    //console.log('Login success!',this.loginForm.value);
    const {username, password} = loginForm.value;

    const loginParameters: LoginForm = {
      username,
      password
    }
    //console.log(localStorage.getItem('user-token'))
    if (!!localStorage.getItem('user-token')){
      this.router.navigate(['/home'])
      this.nzmsgService.info('Vous avez login!',{ nzDuration: 1000});
    }else {
      //console.log("Login form",loginParameters)
      this.loginService.login(loginParameters).subscribe((res: any) => {
        //console.log("User info:",res)
          if (res) {
            localStorage.setItem('user-token', res);
            localStorage.setItem('username-token', res.username);
            localStorage.setItem('role-token', res.role);
            localStorage.setItem('email-token', res.email);
            localStorage.setItem('id-token', res.id);
            this.router.navigate(['/home'])
            this.nzmsgService.info('Bienvenue, '+res.username,{nzDuration:1000})
          } else {
            //console.log(res)
            this.router.navigate(['/login'])
            this.nzmsgService.info('Le nom ou mot de passe n\'est pas valide!', {nzDuration: 1000});
          }
        }
      );
    }
  }

  userAddForm!: FormGroup;

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.userAddForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  resetForm(e:MouseEvent):void {
    e.preventDefault();
    this.userAddForm.reset();
    for (const i in this.userAddForm.controls) {
      if (this.userAddForm.controls.hasOwnProperty(i)) {
        this.userAddForm.controls[i].markAsDirty();
        this.userAddForm.controls[i].updateValueAndValidity();
      }
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.userAddForm.controls.checkPassword.updateValueAndValidity());
  }

  isVisible = false;

  showRegisterForm(): void {
    this.isVisible = true;
  }

  register():void{
    const userAddForm= this.userAddForm;
    const {username, email, password, role} = userAddForm.value;

    const addForm: userAddForm = {
      username,
      email,
      password,
      role
    }

    this.userService.addUser(addForm).subscribe((res: any) => {
      //console.log('Add user ', res);
    })
    this.isVisible = false;
  }

  CancelRegister(){
    this.nzmsgService.info("Annuler d'insrire!",{nzDuration:1000})
    this.isVisible = false
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      password: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,20}$/)]],
      //remember: [false]
    });
    this.userAddForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      role: [0, [Validators.required,Validators.max(1),Validators.min(0)]],
    });
  }

}
