import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService } from './services/api.service';
import { Users } from './model/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}
  private apiService: ApiService = inject(ApiService);

  pageSizeOptions: number[] = [10, 20, 50, 100];

  userName: string = '';
  user: string;
  userInfo: any;
  userRepo: any;
  topic: any[] = [];
  mainData: any[] = [];
  pageSize: number = 10;
  pageNumber: number;
  twitter: string;
  condition: boolean = false;
  gifIterator: number[] = Array.from(
    { length: this.pageSize },
    (_, i) => i + 1
  );
  pageList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  subscriberOne: Subscription;
  subscriberTwo: Subscription;

  ngOnInit() {}

  //number of pages for pagination
  getCountRange(): any[] {
    return this.pageList;
  }

  //to get the repo data
  getRepos() {
    this.subscriberTwo = this.apiService
      .getRepo(this.userName, this.pageSize, this.pageNumber)
      .subscribe({
        next: (repoData: any) => {
          this.userRepo = repoData;
        
          this.mainData = [];
          repoData.forEach((data: any, index: any) => {
            this.apiService.getTopic(data.languages_url).subscribe((res) => {
              this.mainData.push({ ...data, language: res });
            });
          });

          this.subscriberTwo.unsubscribe();
        },
        error: (err) => {
          console.log(err.message);
        },
      });
  }


  //to fetch user data by user name
  getGitUser() {
    if (this.userName != '' && this.userName != undefined) {
      this.subscriberOne = this.apiService.getUser(this.userName).subscribe({
        next: (userData) => {
          console.log(userData, this.userName);
          this.userInfo = userData;
          this.twitter = `https://twitter.com/${this.userInfo.twitter_username}`;
          if (userData) {
            this.condition = false;
            this.pageNumber = 1;
            this.getRepos();
            this.subscriberOne.unsubscribe();
          }
        },
        error: (err) => {
          console.log(err.status);
          if (err.status) {
            this.user = this.userName;
            this.condition = true;
            console.log(this.condition);
          }
        },
      });
    }
  }

 //get next repo according to page size
  getNextRepoList(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getRepos();
  }


  //logic for to go to previous page
  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getRepos();
      if (this.pageNumber < this.pageList[0]) {
        const newArray = this.pageList.map((element, index) => {
            return this.pageList[this.pageList.length - 1] - index - 1;
        }).reverse();
        this.pageList = newArray;
        this.getCountRange();
        console.log(newArray, 'page');
    }
    }
  }

  //logic to after clicking the next page
  nextPage() {
    this.pageNumber++;
    this.getRepos();

    if(this.pageNumber > this.pageList[this.pageList.length - 1]){
      const newArray = this.pageList.map((element, index) => index + this.pageList[this.pageList.length - 1] + 1);
     this.pageList = newArray;
     this.getCountRange()
      console.log(newArray, 'page',);
      
     
    
    }
  }
}
