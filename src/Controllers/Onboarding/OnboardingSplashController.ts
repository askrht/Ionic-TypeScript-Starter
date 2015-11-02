module JustinCredible.SampleApp.Controllers {

    export class OnboardingSplashController extends BaseController<ViewModels.EmptyViewModel> {

        //#region Injection

        public static ID = "OnboardingSplashController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$rootScope",
                "$location",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $rootScope: ng.IRootScopeService,
            private $location: ng.ILocationService,
            private $ionicHistory: any,
            private Utilities: Services.Utilities,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.EmptyViewModel);
        }

        //#region BaseController Events

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);
            this.$rootScope.$broadcast(Constants.Events.BEGIN_ONBOARDING);
        }

        //#endregion


        //#endregion

        //#region UI Events

        protected skip_click(): void {
            // Tell Ionic to to hide the back button for the next view.
            this.$ionicHistory.nextViewOptions({
                disableBack: true
            });

            // Navigate the user to their default view.
            this.$location.path(this.Utilities.defaultCategory.href.substring(1));
            this.$location.replace();

            // Set the preference value so onboarding doesn't occur again.
            this.$rootScope.$broadcast(Constants.Events.END_ONBOARDING);
        }

        //#endregion
    }
}
