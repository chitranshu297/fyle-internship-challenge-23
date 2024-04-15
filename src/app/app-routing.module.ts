import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { RepoListComponent } from './components/repo-list/repo-list.component';

const routes: Routes = [
  { path: 'home', component: UserSearchComponent },
  // { path: 'user', component: UserDetailComponent },
  { path: 'user/:userName', component: RepoListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
