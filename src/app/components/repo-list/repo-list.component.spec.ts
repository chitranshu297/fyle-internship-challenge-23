import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterTestingModule } from '@angular/router/testing';
import { RepoListComponent } from './repo-list.component';
import { ApiService } from 'src/app/services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

describe('RepoListComponent', () => {
  let component: RepoListComponent;
  let fixture: ComponentFixture<RepoListComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
 let paginator: MatPaginator;
 let toastrService: ToastrService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepoListComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', ['getUser', 'getRepos']),
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepoListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastrService = TestBed.inject(ToastrService);
    paginator = TestBed.createComponent(MatPaginator).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update displayRepoData on onPageChange()', () => {
    const mockEventData = { pageIndex: 1, pageSize: 10 };
    component.pageData[2] = [{ name: 'repo3' }, { name: 'repo4' }];
    spyOn(component, 'getRepos');

    component.onPageChange(mockEventData);

    expect(component.pageSize).toBe(10);
    expect(component.current_page).toBe(2);
    expect(component.displayRepoData).toEqual([
      { name: 'repo3' },
      { name: 'repo4' },
    ]);
    expect(component.getRepos).not.toHaveBeenCalled();
  });

  it('should fetch repos on getRepos()', () => {
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    apiService.getRepos.and.returnValue(of(mockRepos));

    component.githubUserName = 'testuser';
    component.getRepos();

    expect(apiService.getRepos).toHaveBeenCalledWith('testuser', 1, 10);
    expect(component.isLoadingRepos).toBeFalse();
    expect(component.displayRepoData).toEqual(mockRepos);
  });

  it('should update displayRepoData on onPageChange', () => {
    const mockEventData = { pageIndex: 1, pageSize: 10 };
    component.pageData[2] = [{ name: 'repo3' }, { name: 'repo4' }];

    component.onPageChange(mockEventData);

    expect(component.pageSize).toBe(10);
    expect(component.current_page).toBe(2);
    expect(component.displayRepoData).toEqual([
      { name: 'repo3' },
      { name: 'repo4' },
    ]);
  });

  it('should handle error in getRepos', () => {
    apiService.getRepos.and.returnValue(throwError('Error'));

    component.githubUserName = 'testuser';
    component.getRepos();

    expect(apiService.getRepos).toHaveBeenCalledWith('testuser', 1, 10);
    expect(component.isLoadingRepos).toBeFalse();
  });

  it('should fetch repositories when getRepos is called', () => {
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    apiService.getRepos.and.returnValue(of(mockRepos));

    component.githubUserName = 'testuser';
    component.getRepos(2, 15);

    expect(apiService.getRepos).toHaveBeenCalledWith('testuser', 2, 15);
    expect(component.isLoadingRepos).toBeFalse();
    expect(component.displayRepoData).toEqual(mockRepos);
  });

  it('should handle error in getUserDetails', () => {
    apiService.getUser.and.returnValue(throwError('Error'));

    component.githubUserName = 'testuser';
    component.getUserDetails();

    expect(apiService.getUser).toHaveBeenCalledWith('testuser');
    expect(component.isLoadingUserDetails).toBeFalse();
  });

  it('should fetch user details and repositories when getUserDetails is called', () => {
    const mockUser = { login: 'testuser', public_repos: 5 };
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    apiService.getUser.and.returnValue(of(mockUser));
    apiService.getRepos.and.returnValue(of(mockRepos));

    component.githubUserName = 'testuser';
    component.getUserDetails();

    expect(apiService.getUser).toHaveBeenCalledWith('testuser');
    expect(component.isLoadingUserDetails).toBeFalse();
    expect(component.userData).toEqual(mockUser);
    expect(component.isLoadingRepos).toBeFalse();
    expect(apiService.getRepos).toHaveBeenCalledWith('testuser', 1, 10);
    expect(component.displayRepoData).toEqual(mockRepos);
  });

  it('should set paginator labels if paginator is available', () => {
  const mockPaginator = jasmine.createSpyObj('MatPaginator', ['_intl']);
  component.paginator = mockPaginator;

  component.ngOnInit();

  expect(mockPaginator._intl.nextPageLabel).toBe('Newer');
  expect(mockPaginator._intl.previousPageLabel).toBe('Older');
});

  it('should update displayRepoData and pageData on onPageChange when page size changes', () => {
    const mockEventData = { pageIndex: 1, pageSize: 15 };
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    spyOn(component, 'getRepos').and.returnValue(undefined);

    component.pageData[1] = mockRepos;

    component.onPageChange(mockEventData);

    expect(component.pageSize).toBe(15);
    expect(component.current_page).toBe(2);
    expect(component.isLoadingRepos).toBeTrue();
    expect(component.getRepos).toHaveBeenCalledWith(2, 15);
    expect(component.prevPageSize).toBe(15);
    expect(component.pageData).toEqual({});
  });

  it('should update displayRepoData from pageData when data exists for the page', () => {
    const mockRepos = [{ name: 'repo1' }, { name: 'repo2' }];
    component.pageData[1] = mockRepos;

    component.getRepos(1);

    expect(component.displayRepoData).toEqual(mockRepos);
  });
});