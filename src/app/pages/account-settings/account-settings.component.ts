import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

   // console.log(links);

  constructor( private settingsService: SettingsService) { 

   // console.log(this.links);
  }

  ngOnInit(): void {

    
    this.settingsService.checkCurrentTheme();
    
  }

  changeTheme(theme: string) {

    this.settingsService.changeTheme( theme); 
    
  }



}
