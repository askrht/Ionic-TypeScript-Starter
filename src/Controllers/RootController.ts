﻿module JustinCredible.SampleApp.Controllers {

    export class RootController extends BaseController<ViewModels.RootViewModel> {

        //#region Injection

        public static ID = "RootController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$window",
                "$location",
                "$http",
                "$ionicHistory",
                "$ionicSideMenuDelegate",
                Services.Plugins.ID,
                Services.Utilities.ID,
                Services.UiHelper.ID,
                Services.Preferences.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $window: Window,
            private $location: ng.ILocationService,
            private $http: ng.IHttpService,
            private $ionicHistory: any,
            private $ionicSideMenuDelegate: any,
            private Plugins: Services.Plugins,
            private Utilities: Services.Utilities,
            private UiHelper: Services.UiHelper,
            private Preferences: Services.Preferences,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.RootViewModel);
        }

        //#endregion

        private _hasLoaded = false;

        //#region BaseController Overrides

        protected view_loaded(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_loaded(event, eventArgs);

            // In most cases Ionic's load event only fires once, the first time the controller is
            // initialize and attached to the DOM. However, abstract controllers (eg this one) will
            // have their Ionic view events fired for child views as well. Here we ensure that we
            // don't run the code below if we've already loaded before and a child is loading.
            if (this._hasLoaded) {
                return;
            }

            this._hasLoaded = true;

            this.scope.$on(Constants.Events.HTTP_UNAUTHORIZED, _.bind(this.http_unauthorized, this));
            this.scope.$on(Constants.Events.HTTP_FORBIDDEN, _.bind(this.http_forbidden, this));
            this.scope.$on(Constants.Events.HTTP_NOT_FOUND, _.bind(this.http_notFound, this));
            this.scope.$on(Constants.Events.HTTP_UNKNOWN_ERROR, _.bind(this.http_unknownError, this));
            this.scope.$on(Constants.Events.HTTP_ERROR, _.bind(this.http_error, this));
            this.scope.$on(Constants.Events.BEGIN_ONBOARDING, _.bind(this.begin_onboarding, this));
            this.scope.$on(Constants.Events.END_ONBOARDING, _.bind(this.end_onboarding, this));
            this.viewModel.categories = this.Utilities.categories;

        }

        //#endregion

        //#region Event Handlers

        private http_unauthorized(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {

            // Unauthorized should mean that a token wasn't sent, but we'll null these out anyways.
            this.Preferences.userId = null;
            this.Preferences.token = null;

            this.Plugins.toast.showLongBottom("You do not have a token (401); please login.");
        }

        private http_forbidden(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {

            // A token was sent, but was no longer valid. Null out the invalid token.
            this.Preferences.userId = null;
            this.Preferences.token = null;

            this.Plugins.toast.showLongBottom("Your token has expired (403); please login again.");
        }

        private http_notFound(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {
            // The restful API services are down maybe?
            this.Plugins.toast.showLongBottom("Server not available (404); please contact your administrator.");
        }

        private http_unknownError(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {
            // No network connection, invalid certificate, or other system level error.
            this.Plugins.toast.showLongBottom("Network error; please try again later.");
        }

        /**
         * A generic catch all for HTTP errors that are not handled above in the other
         * error handlers.
         */
        private http_error(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>): void {
            this.Plugins.toast.showLongBottom("An error has occurred; please try again.");
        }

        /**
         * An event listerer to hide the left side menu during onboarding.
         * A child like OnboardingSplashController fires this event, like so,
         * this.scope.$emit(Constants.Events.BEGIN_ONBOARDING);
         */
        private begin_onboarding(): void {
            this.Configuration.hasCompletedOnboarding = false;
            this.viewModel.isOnboarding = true;
            this.$ionicSideMenuDelegate.canDragContent(false);
        }

        /**
         * An event listener to un-hide the left side and navigate to the default view,
         * after onboarding ends. A child like OnboardingSplashController fires this event,
         * like so, this.scope.$emit(Constants.Events.END_ONBOARDING);
         */
        private end_onboarding(): void {
            this.Configuration.hasCompletedOnboarding = true;
            this.viewModel.isOnboarding = false;

            // Expose the side menu in a tablet
            var isTablet = this.$window.matchMedia(this.viewModel.sideMenuMediaQuery).matches;
            this.$ionicSideMenuDelegate._instances[0].exposeAside(isTablet); // sigh
            this.$ionicSideMenuDelegate.canDragContent(true);

            // Tell Ionic to to hide the back button for the next view.
            this.$ionicHistory.nextViewOptions({
                disableBack: true
            });

            // Navigate the user to their default view.
            this.$location.path(this.Utilities.defaultCategory.href.substring(1));
            this.$location.replace();
        }

        //#endregion

        //#region Controller Methods

        protected reorder_click() {
            this.UiHelper.showDialog(ReorderCategoriesController.ID).then(() => {
                // After the re-order dialog is closed, re-populate the category
                // items since they may have been re-ordered.
                this.viewModel.categories = this.Utilities.categories;
            });
        }

        //#endregion
    }
}
