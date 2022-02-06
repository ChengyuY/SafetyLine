import { Component, OnInit } from '@angular/core';
import {IssueService} from "../issue.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Issue} from "../issue.type";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-issue-valid',
  templateUrl: './issue-valid.component.html',
  styleUrls: ['./issue-valid.component.css']
})
export class IssueValidComponent implements OnInit {
  constructor(private issueService: IssueService, private nzmsgService: NzMessageService) { }


  // @ts-ignore
  listOfIssue: Issue[];
  curPage = 1;
  pageSize = 7;
  chiffrement ?: string;
  id ?: number;
  fetchIssue(){

    this.issueService.refreshIssue().subscribe(res=>{
      //console.log(res)
    })

    this.issueService.fetchIssue(this.curPage,this.pageSize).subscribe((res: HttpResponse<Issue[]>)=>
    {
      //console.log('Get data ',res);
      //this.total = +res.headers.get('X-Total-Count');
      // @ts-ignore
      this.listOfIssue = res.body;
    })
  }

  trackByUserId(id: number, issue: Issue){
    return issue.id
  }

  isVisible = false;
  showFlag!: boolean;

  showModal(id:number, updated:number): void {
    const roleToken = localStorage.getItem('role-token')
    // @ts-ignore
    if (roleToken != 1){
      this.nzmsgService.info('Vous n\'avez pas le droit de le faire!',{ nzDuration: 1000});
    }else {
      if (updated == 1){
        this.nzmsgService.info('Cette issue n\'est peut pas être modifié!',{ nzDuration: 1000});
      }
      else{
        this.isVisible = true;
        // @ts-ignore
        this.issueService.getIssueId(id).subscribe((issue: Issue) => {
          //console.log(issue)
          this.id = id
        })
      }
    }
  }

  handleModifierOk(): void {
    if (this.chiffrement != null) {
      if (this.id != null) {
        this.issueService.editTime(this.id, this.chiffrement).subscribe(res => {
          //console.log(res)
          if (!res){
            this.nzmsgService.info('L\'entrée ne respecte pas le format du chiffrage', {nzDuration:1000});
          }else{
            this.isVisible = false;
            location.reload();
          }
        })
      }
    }else{
      this.nzmsgService.info('L\'entrée ne peut pas être vide', {nzDuration:1000});
    }
  }

  handleModifierCancel(): void {
    this.isVisible = false;
    this.nzmsgService.info('Annuler la modification', {nzDuration:1000});
  }

  handleValid(id:number,updated:number): void{
    const token = localStorage.getItem('role-token')
    // @ts-ignore
    if (token != 1){
      this.nzmsgService.info('Vous n\'avez pas le droit de le faire!',{ nzDuration: 1000});
    }else {
      if (updated == 1){
        this.nzmsgService.info('Cette issue a été validé',{ nzDuration: 1000});
      }
      else {
        this.issueService.validIssue(id).subscribe(res => {
          console.log(res);
        })
        this.fetchIssue()
        this.nzmsgService.info('Verifier la validation', {nzDuration: 1000});
        location.reload();
      }
    }
  }

  handleValidCan(): void{
    this.nzmsgService.info('Annuler la validation', {nzDuration:1000});
  }

  ngOnInit(): void {
    this.fetchIssue();
    // @ts-ignore
    this.showFlag = localStorage.getItem('role-token')!= 1;
  }

}
