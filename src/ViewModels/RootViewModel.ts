module JustinCredible.SampleApp.ViewModels {

    export class RootViewModel {
        public categories: ViewModels.CategoryItemViewModel[];

        /**
         * Property to monitor onboarding.
         */
        public isOnboarding: boolean;

        /**
        * Returns false is the user is onboarding, true otherwise.
        */
        public get isLeftSideMenuEnabled(): boolean {
            return this.isOnboarding ? false : true;
        }

        /**
        * Property used to expose the media query for the side menu.
        */
        public get sideMenuMediaQuery(): string {
            return this.isOnboarding ?
                   "(min-width: 99999999px) and (orientation: landscape)" :
                   "(min-width: 768px) and (orientation: landscape)";
        }
    }
}
