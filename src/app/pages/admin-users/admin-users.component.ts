
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MovieService } from '../../services/server/movie.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { userData ,userListsResponse ,userResponse   } from '../../Types/User.types';
import {  ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingState } from '../../Types/loading-state.model';
import { NgIcon , provideIcons } from '@ng-icons/core';
import { faSolidTrashArrowUp,faSolidUserPlus } from '@ng-icons/font-awesome/solid';
import {bootstrapStarFill} from '@ng-icons/bootstrap-icons';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-admin-users',
  imports: [CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,NgIcon,
  ],
    providers: [UserService],
  templateUrl: './admin-users.component.html',
  styles: ``,
   viewProviders:[provideIcons({faSolidTrashArrowUp,bootstrapStarFill,faSolidUserPlus})]
})
export class AdminUsersComponent implements OnInit{

  users: userData[] = []; // Array to hold users
  loading: boolean = false;
  error: string | null = null;
   constructor(private userService: UserService, private toast: ToastService , private activeRoute:ActivatedRoute , private router:Router) {
   
  }



    ngOnInit(): void {
      // this.restoreState();
      this.loadUsers();

    }

  
    //load user
    loadUsers(): void 
      {
        this.loading = true;
        this.userService.getAllUsers().subscribe({
            next: (users) => {
              this.users = users; 
              console.log(this.users);
              console.log(users[0]);
              this.loading = false;
            },
            error: (err) => {
              this.error = 'Failed to load users'; 
              this.loading = false;
              console.error('Error fetching users:', err); 
            },
        });
      }
    

    //make user admin
    //not tested 
    makeAdmin(id:string):void
    {
      this.userService.makeAdmin(id).subscribe(
        {
          next : (res)=>{
            this.showSuccessToast('User Updated Successfully');
            this.loadUsers();
          },
          error : (error)=>{
            console.log("Error",error);
            this.showErrorToast('Error Updating User');
          }
        }
      );
    }
    //delete user
    //not tested
    deleteUser(id: string) {
      this.userService.deletUser(id).subscribe(
        {
          next : (res)=>{
            this.showSuccessToast('User Deleted Successfully');
            this.loadUsers();
          },
          error : (error)=>{
            console.log("Error",error);
            this.showErrorToast('Error Deleting User');
          }
        }
      );
    }

     showErrorToast(errorMsg:string) {
      this.toast.error(errorMsg, {
        title: 'Error',
        duration: 3000,
        cancelable: true,
        showIcon: true,
      });
    }

    showSuccessToast(successMsg:string) {
      this.toast.success(successMsg, {
        title: 'Success',
        duration: 3000,
        cancelable: true,
        showIcon: true,
      });
    }


    

    
}

