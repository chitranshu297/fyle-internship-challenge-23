import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.scss'],
})
export class RepoListComponent {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator | any;
  // loading variables
  isLoadingRepos: boolean = true;
  isLoadingUserDetails: boolean = true;

  // pagination variables
  current_page: number = 1;
  pageSize: number = 10;
  prevPageSize: number = 10;
  pageData: object | any = {};
  pageSizeOptions: any = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // user details
  userData: any = {};
  githubUserName: string = '';

  // repo variables
  totalRepos: number = 0;
  totalReposFetched: object[] = [];
  displayRepoData: object[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paginator._intl.nextPageLabel = 'Newer';
    this.paginator._intl.previousPageLabel = 'Older';
    this.githubUserName = this.activatedRoute.snapshot.params['userName'];
    this.getUserDetails();
  }

  getUserDetails() {
    this.apiService.getUser(this.githubUserName)?.subscribe(
      (res: any) => {
        this.isLoadingUserDetails = false;
        this.totalRepos = res?.public_repos;
        if (this.totalRepos > 0) {
          this.userData = res;
          this.isLoadingRepos = true;
          this.getRepos();
        }
      },
      (err) => {
        // alert(
        //   err?.error?.message ? err?.error?.message : 'Something went wrong'
        // );
        this.isLoadingUserDetails = false;
      }
    );
  }

  getRepos(page: number = 1, pageSize: number = 10) {
    if (this.pageData[page]) {
      this.displayRepoData = this.pageData[page];
      return;
    }

    this.isLoadingRepos = true;
    this.apiService.getRepos(this.githubUserName, page, pageSize).subscribe(
      (res: any) => {
        this.isLoadingRepos = false;
        this.displayRepoData = res;
        this.pageData[page] = res;
      },
      (err) => {
        alert(
          err?.error?.message ? err?.error?.message : 'Something went wrong'
        );
        this.isLoadingRepos = false;
      }
    );
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.current_page = event.pageIndex + 1;

    if (
      this.pageData[this.current_page] &&
      this.pageSize === this.prevPageSize
    ) {
      this.displayRepoData = this.pageData[this.current_page];
    } else {
      if (this.pageSize !== this.prevPageSize) {
        this.pageData = {};
      }
      this.isLoadingRepos = true;
      this.getRepos(this.current_page, this.pageSize);
      this.prevPageSize = this.pageSize;
    }
  }
}
