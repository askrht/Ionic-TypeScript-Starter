module JustinCredible.SampleApp.Controllers {

    export class OnboardingSplashController extends BaseController<ViewModels.EmptyViewModel> {

        //#region Injection

        public static ID = "OnboardingSplashController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$location",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $ionicHistory: any,
            private Utilities: Services.Utilities,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.EmptyViewModel);
        }

        //#region BaseController Events

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            // Inform the RootController to begin onboarding
            this.scope.$emit(Constants.Events.BEGIN_ONBOARDING);
        }

        //#endregion


        //#endregion

        //#region UI Events

        protected skip_click(): void {

            // Inform the RootController to end onboarding
            this.scope.$emit(Constants.Events.END_ONBOARDING);
        }

        //#endregion
    }
}
