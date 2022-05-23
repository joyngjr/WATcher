import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubUser } from '../models/github-user.model';
// import { Team } from '../models/team.model';
import { User, UserRole } from '../models/user.model';
// import { DataService } from './data.service';
import { GithubService } from './github.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Responsible for creation of users and teams within the WATcher application.
 */
export class UserService {
  public currentUser: User;

  constructor(private githubService: GithubService) {}

  /**
   * Get the authenticated user if it exist.
   */
  getAuthenticatedUser(): Observable<GithubUser> {
    return this.githubService.fetchAuthenticatedUser().pipe(
      map((data: GithubUser) => {
        return data;
      })
    );
  }

  createUserModel(userLoginId: string): Observable<User> {
    this.currentUser = this.createUser({}, userLoginId);
    console.log(this.currentUser);
    // to refactor
    const o = new Observable<User>((s) => {
      s.next(this.currentUser);
      s.complete();
    });
    return o;

    // No data.csv to read
    /*return this.dataService.getDataFile().pipe(
      map((jsonData: {}) => {
        this.currentUser = this.createUser(jsonData, userLoginId);
        return this.currentUser;
      }),
      filter((user) => user !== null),
      throwIfEmpty(() => new Error('Unauthorized user.'))
    );
    */
  }

  reset() {
    this.currentUser = undefined;
  }

  private createUser(data: {}, userLoginId: string): User {
    return <User>{ loginId: userLoginId, role: UserRole.Student, team: null };

    /*
    const lowerCaseUserLoginId = userLoginId.toLowerCase();

    const userRole = this.parseUserRole(data, lowerCaseUserLoginId);
    switch (userRole) {
      case UserRole.Student:
        const teamId = data[DataService.STUDENTS_ALLOCATION][lowerCaseUserLoginId][DataService.TEAM_ID];
        const studentTeam = this.createTeamModel(data[DataService.TEAM_STRUCTURE], teamId);
        return <User>{ loginId: userLoginId, role: userRole, team: studentTeam };

      case UserRole.Tutor:
        const tutorTeams: Array<Team> = Object.keys(
          data[DataService.TUTORS_ALLOCATION][lowerCaseUserLoginId]
        ).map((allocatedTeamId: string) => this.createTeamModel(data[DataService.TEAM_STRUCTURE], allocatedTeamId));

        return <User>{ loginId: userLoginId, role: userRole, allocatedTeams: tutorTeams };

      case UserRole.Admin:
        const studentTeams: Array<Team> = Object.keys(
          data[DataService.ADMINS_ALLOCATION][lowerCaseUserLoginId]
        ).map((allocatedTeamId: string) => this.createTeamModel(data[DataService.TEAM_STRUCTURE], allocatedTeamId));

        return <User>{ loginId: userLoginId, role: userRole, allocatedTeams: studentTeams };
      default:
        return null;
    }
    */
  }

  /* Not needed in WATcher
  private createTeamModel(teamData: {}, teamId: string): Team {
    const teammates: Array<User> = Object.values(teamData[teamId]).map(
      (teammate: string) => <User>{ loginId: teammate, role: UserRole.Student }
    );

    return new Team({ id: teamId, teamMembers: teammates });
  }*/

  /**
   * To be used to parse the JSON data containing data pertaining to the user role.
   *
   * @return NULL if user is unauthorized, meaning that no role is specified for the user.
   *         else the the role with the highest access rights will be returned.
   */
  /* No json to parse
  private parseUserRole(data: {}, userLoginId: string): UserRole {
    let userRole: UserRole;
    if (data[DataService.ROLES][DataService.STUDENTS] && data[DataService.ROLES][DataService.STUDENTS][[userLoginId]]) {
      userRole = UserRole.Student;
    }
    if (data[DataService.ROLES][DataService.TUTORS] && data[DataService.ROLES][DataService.TUTORS][[userLoginId]]) {
      userRole = UserRole.Tutor;
    }
    if (data[DataService.ROLES][DataService.ADMINS] && data[DataService.ROLES][DataService.ADMINS][[userLoginId]]) {
      userRole = UserRole.Admin;
    }
    return userRole;
  }
  */
}
