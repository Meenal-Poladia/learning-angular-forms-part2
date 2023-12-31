import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsername: any = ['Chris', 'Anna'];

  ngOnInit() {
    this.signupForm = new FormGroup<any>({
      'userData' : new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmail),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    })
    //This is fired whenever there is a change in the value of the input. At every keystroke
    this.signupForm.valueChanges
      .subscribe(value => {
        console.log(value)
      })

    //This can be used to see if the field is valid or invalid. It can be hooked to either one input or entire form
    this.signupForm.statusChanges
      .subscribe(status => {
        console.log(status)
      })

    //To set or update all the values in the form
    this.signupForm.setValue({
      'userData': {
        'username': 'Max',
        'email': 'max@test.com'
      },
      'gender': 'male',
      'hobbies': ['cook', 'dance']
    })

    //To update or set only few values in the form
    this.signupForm.patchValue({
      'userData': {
        'username': 'Alenxander',
      },
    })

  }

  onSubmit() {
    console.log(this.signupForm);

    //Reset the form. We can also choose to reset particular field only
    this.signupForm.reset();
  }

  onAddHobby() {
    (<FormArray>this.signupForm.get('hobbies'))
      .push(new FormControl(null, Validators.required))
  }

  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if(this.forbiddenUsername.indexOf(control.value) !== -1 ) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  forbiddenEmail(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@gmail.com') {
          resolve({'emailIsForbidden': true})
        } else {
          resolve(null);
        }
      }, 1500)
    })
    return promise
  }
}
