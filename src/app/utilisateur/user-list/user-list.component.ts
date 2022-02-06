import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from "../utilisateur.service";
import { User } from '../utilisateur.type';
import { HttpResponse } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";

//ng g c utilisateur/user-list

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private userService: UtilisateurService, private nzmsgService: NzMessageService) { }


  // @ts-ignore
  listOfUser: User[];

  curPage = 1;
  pageSize = 8;
  //total: number;

  handleDel(id: number){
    const token = localStorage.getItem('role-token')
    // @ts-ignore
    if (token != 1){
      this.nzmsgService.info('You do not have the access!',{ nzDuration: 1000});
    }else {
      const id_token = localStorage.getItem('id-token')
      // @ts-ignore
      if (id == id_token){
        this.nzmsgService.info('You can not delete yourself!',{ nzDuration: 1000})
      }else {
        this.userService.delUser(id).subscribe(res => {
          //console.log('Delete!', id);
          // @ts-ignore
          this.listOfUser = this.listOfUser.filter(user => user.id !== id);
        })
      }
    }
  }

  handleDelCan(){
    //console.log('Cancel delete!');
    this.nzmsgService.info('Cancel delete!',{ nzDuration: 1000});
  }

  handleChange(id: number){
    const token = localStorage.getItem('role-token')
    const id_token = localStorage.getItem('id-token')
    // @ts-ignore
    if (id == id_token){
      this.nzmsgService.info('Vous ne pouvez pas changer votre rôle',{ nzDuration: 1000});
    }else{
      // @ts-ignore
      if (token != 1){
        this.nzmsgService.info('Vous n\'avez pas le droit de le faire!',{ nzDuration: 1000});
      }else{
        this.userService.changeRoleUser(id).subscribe(res=>{
          //console.log('Change role', id);
        })
        this.fetchUser()
        location.reload()
      }
    }
  }

  handleRoleCan() {
    //console.log('Cancel change role!');
    this.nzmsgService.info('Annuler la suppression!',{ nzDuration: 1000});
  }

  trackByUserId(id: number, user: User){
    return user.id
  }


  fetchUser(){
    this.userService.fetchData(this.curPage,this.pageSize).subscribe((res: HttpResponse<User[]>)=>
    {
      //console.log('Get data ',res);
      //this.total = +res.headers.get('X-Total-Count');
      // @ts-ignore
      this.listOfUser = res.body;
    })
  }

  ngOnInit(): void {
    // @ts-ignore
    if (localStorage.getItem('role-token')==1){
      this.fetchUser();
    }
  }


}
