import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent {
  constructor(private router: Router) {}
  username: string = '';
  search(): void {
    if (this.username == '') return;
    this.router.navigate(['/user', this.username]);
  }
}
