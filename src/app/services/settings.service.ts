import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() { 
    
    const url = localStorage.getItem('theme') || './assets/css/colors/default.css';
    this.linkTheme.setAttribute('href', url);
  }


  changeTheme(theme: string) {

    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentTheme();
  
  }


  checkCurrentTheme() {

    const links=  document.querySelectorAll('.selector') ;  
 
    links.forEach( elem => {
    
      elem.classList.remove('working');
      const bntTheme = elem.getAttribute('data-theme');
      const bntThemeUrl = `./assets/css/colors/${bntTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');
    
      if (bntThemeUrl === currentTheme){
    
        elem.classList.add('working');
      }
    
    })
    
    }


}
