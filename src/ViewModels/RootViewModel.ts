module JustinCredible.SampleApp.ViewModels {

    export class RootViewModel {
        public categories: ViewModels.CategoryItemViewModel[];

        /**
         * Property to monitor onboarding.
         */
        public isOnboarding: boolean;

        /**
        * Property used to expose the media query for the side menu.
        */
        public get sideMenuMediaQuery(): string {
            return this.isOnboarding ?
                   "(min-width: 99999999px) and (orientation: landscape)" : // never show the side menu
                   "(min-width: 768px) and (orientation: landscape)"; // show the side menu only in a tablet
        }
    }
}
