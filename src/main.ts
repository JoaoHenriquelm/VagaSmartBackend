import dotenv from "dotenv"
import { resolve } from "path";
import { SqliteGateEvent } from "./repositories/sqlite-repository/sqlite-gateEvent-repository";
import { SqliteTransaction } from "./repositories/sqlite-repository/sqlite-transaction-repository";
import { SqliteUser } from "./repositories/sqlite-repository/sqlite-user-repository";
import { SqliteVehicle } from "./repositories/sqlite-repository/sqlite-vehicle-repository";
import { SqliteWallet } from "./repositories/sqlite-repository/sqlite-wallet-repository";
import { CreateGateEvent } from "./usecases/create-gate-event";
import { CreateUserAndWallet } from "./usecases/create-user-and-wallet";
import { CreateVehicle } from "./usecases/create-vehicle";
import { IndexUnathorizedGateEvents } from "./usecases/index-unathorized-gateEvent";
import { IndexVehicles } from "./usecases/index-vehicles";
import { LoginUser } from "./usecases/login-user";
import { VerifyToken } from "./usecases/verify-token";
import { ShowUserAndWalletAndGateEvents } from "./usecases/show-user-and-wallet-and-gate-event";
import { UpdateGateEvent } from "./usecases/update-gateEvent";
import { UpdateWallet } from "./usecases/update-wallet";
import { ShowDashboardRoute } from "./infra/express/routes/dashboard/show-dashboard-express-route";
import { CreateGateEventRoute } from "./infra/express/routes/gateEvent/create-gate-event-express-route";
import { IndexUnathorizedGateEventsRoute } from "./infra/express/routes/gateEvent/index-unathorized-gate-events-express-route";
import { CreateUserRoute } from "./infra/express/routes/register/create-user-express-route";
import { CreateVehicleRoute } from "./infra/express/routes/vehicle/create-vehicle-express-route";
import { UpdateWalletRoute } from "./infra/express/routes/wallet/update-wallet-express-route";
import { UpdateGateEventRoute } from "./infra/express/routes/gateEvent/update-gate-event-express-route";
import { LoginUserRoute } from "./infra/express/routes/login/login-user-express-route";
import { VerifyTokenRoute } from "./infra/express/routes/login/verify-login-express-route";
import { ApiExpress } from "./infra/express/api-express";
import { IndexVehiclesRoute } from "./infra/express/routes/vehicle/index-vehicles-express-route";

function main() {
    dotenv.config({path: resolve(__dirname, '../.env')})
    
    const gateEventRepository = new SqliteGateEvent()
    const transactionRepository = new SqliteTransaction()
    const userRepository = new SqliteUser()
    const vehicleRepository = new SqliteVehicle()
    const walletRepository = new SqliteWallet() 

    const createGateEventUseCase = new CreateGateEvent(gateEventRepository)
    const createUserAndWalletUseCase = new CreateUserAndWallet(userRepository, walletRepository)
    const createVehicle = new CreateVehicle(vehicleRepository)
    const indexUnathorizedGateEvents = new IndexUnathorizedGateEvents(userRepository, gateEventRepository, vehicleRepository)
    const indexVehicles = new IndexVehicles(vehicleRepository)
    const showUserAndWalletAndGateEvents = new ShowUserAndWalletAndGateEvents(userRepository, walletRepository, gateEventRepository, vehicleRepository)
    const updateGateEvent = new UpdateGateEvent(gateEventRepository)
    const updateWallet = new UpdateWallet(walletRepository, transactionRepository)
    const loginUserUseCase = new LoginUser(userRepository)
    const verifyTokenUseCase = new VerifyToken(userRepository)

    
    const showDashboardRoute = ShowDashboardRoute.show(showUserAndWalletAndGateEvents)
    const createGateEventRoute = CreateGateEventRoute.create(createGateEventUseCase)
    const indexUnathorizedGateEventsRoute = IndexUnathorizedGateEventsRoute.index(indexUnathorizedGateEvents)
    const createUserRoute = CreateUserRoute.create(createUserAndWalletUseCase)
    const createVehicleRoute = CreateVehicleRoute.create(createVehicle)
    const updateWalletRoute = UpdateWalletRoute.update(updateWallet)
    const updateGateEventRoute = UpdateGateEventRoute.update(updateGateEvent)
    const loginUserRoute = LoginUserRoute.create(loginUserUseCase)
    const verifyTokenRoute = VerifyTokenRoute.create(verifyTokenUseCase)
    const indexVehiclesRoute = IndexVehiclesRoute.index(indexVehicles)

    const api = ApiExpress.create([showDashboardRoute, createGateEventRoute, indexUnathorizedGateEventsRoute, createUserRoute, createVehicleRoute, updateWalletRoute, updateGateEventRoute, loginUserRoute, verifyTokenRoute, indexVehiclesRoute])
    api.start(Number(process.env.PORT))
}
main()