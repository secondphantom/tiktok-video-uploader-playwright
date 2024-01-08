import { LoginService } from "../service/login.service";

export class LoginController {
  constructor(private loginService: LoginService) {}

  login = async () => {
    const result = await this.loginService.login();
    return result;
  };
}
