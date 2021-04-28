import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component  {

  public labels1: string [] = ['Gaseosa', 'Galleta', 'Leches'];
  public data1 = [  [15, 25, 60],];
  public colors1  = [ {backgroundColor: ['#6557E6','#999FEE','#FF0000']}];


}
