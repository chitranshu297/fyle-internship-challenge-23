import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user data from GitHub API', () => {
    const mockUserData = { login: 'testuser', public_repos: 5 };
    const githubUsername = 'testuser';

    service.getUser(githubUsername).subscribe((res: any) => {
      expect(res).toEqual(mockUserData);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${githubUsername}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUserData);
  });

  it('should get repositories data from GitHub API with default parameters', () => {
    const mockReposData = [{ name: 'repo1' }, { name: 'repo2' }];
    const githubUsername = 'testuser';

    service.getRepos(githubUsername).subscribe((res: any) => {
      expect(res).toEqual(mockReposData);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${githubUsername}/repos?page=1&per_page=10`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReposData);
  });

  it('should get repositories data from GitHub API with custom parameters', () => {
    const mockReposData = [{ name: 'repo3' }, { name: 'repo4' }];
    const githubUsername = 'testuser';
    const pageNumber = 2;
    const pageSize = 15;

    service
      .getRepos(githubUsername, pageNumber, pageSize)
      .subscribe((res: any) => {
        expect(res).toEqual(mockReposData);
      });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${githubUsername}/repos?page=${pageNumber}&per_page=${pageSize}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReposData);
  });
});
