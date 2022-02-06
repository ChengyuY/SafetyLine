import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from "../../utilisateur/utilisateur.service";
import { User} from "../../utilisateur/utilisateur.type";
import { HttpResponse } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";
import {Issue} from "../issue.type";
import {IssueService} from "../issue.service";

//ng g c utilisateur/user-list

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private userService: UtilisateurService, private nzmsgService: NzMessageService, private issueServeice: IssueService) {
    // @ts-ignore
    this.showFlag = localStorage.getItem('role-token') != 1;
    const usernameToken = localStorage.getItem('username-token')
    // @ts-ignore
    this.issueServeice.fetchIssueByName(usernameToken).subscribe((res: HttpResponse<Issue[]>) => {
      //console.log('Get issues by name', res);
      // @ts-ignore
      this.listOfIssue = res.body;
    })
  }


  // @ts-ignore
  listOfUser: User[];

  curPage = 1;
  pageSize = 7;
  //total: number;

  showFlag !: boolean;

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

  isVisible = false;

  id ?: number;
  // @ts-ignore
  listOfIssue:Issue[];

  showModal(username:string): void {
    const roleToken = localStorage.getItem('role-token')
    const usernameToken = localStorage.getItem('username-token')
    // @ts-ignore
    if (usernameToken == username || roleToken == 1 ){
      this.isVisible = true;
      this.issueServeice.fetchIssueByName(username).subscribe((res: HttpResponse<Issue[]>) => {
        //console.log('Get issues by name', res);
        // @ts-ignore
        this.listOfIssue = res.body;
      })
    }else {
      this.nzmsgService.info('Vous n\'avez pas le droit de le faire!',{ nzDuration: 1000});
    }
  }

  handleModifierOk(): void {
    this.isVisible = false;
    location.reload();
  }

  handleModifierCancel(): void {
    this.isVisible = false;
  }

  ngOnInit(): void {
    this.fetchUser();
  }

}
