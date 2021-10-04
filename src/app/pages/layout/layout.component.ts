import { Component, OnInit ,Input} from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Menu } from 'src/app/_model/menu';
import { LoginService } from 'src/app/_service/login.service';
import { MenuService } from 'src/app/_service/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  menus: Menu[];

 usuario: String;
 rol : String;
  constructor(
    private menuService: MenuService,
    public loginService : LoginService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;
    this.usuario = this.usuario.toUpperCase();
    var RolUser = decodedToken.authorities;
    this.rol = RolUser.toString().replace(/,/g,' - ');
    this.menuService.getMenuCambio().subscribe(data => {
    this.menus = data;
    });
  }
}
