module JustinCredible.SampleApp.Controllers {

    export class OnboardingShareController extends BaseController<ViewModels.EmptyViewModel> {

        //#region Injection

        public static ID = "OnboardingShareController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$location",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.Plugins.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $ionicHistory: any,
            private Utilities: Services.Utilities,
            private Plugins: Services.Plugins,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.EmptyViewModel);
        }

        //#endregion

        //#region UI Events

        protected share_click(platformName: string): void {
            this.Plugins.toast.showShortCenter("Share for " + platformName);
        }

        protected done_click(): void {

            // Inform the RootController to end onboarding
            this.scope.$emit(Constants.Events.END_ONBOARDING);
        }

        //#endregion
    }
}
