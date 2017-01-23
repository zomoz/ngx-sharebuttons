import {
    Component,
    OnChanges,
    Input,
    Output,
    SimpleChanges,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy
} from '@angular/core';

import { ShareButtonsService } from '../../service/share-buttons.service';
import { ShareButton, ShareArgs, ShareProvider } from '../../helpers';


@Component({
    selector: 'share-button',
    templateUrl: './share-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareButtonComponent implements OnChanges {

    /** Share Args */
    @Input() url: string;
    @Input() title: string;
    @Input() description: string;
    @Input() image: string;
    @Input() tags: string;

    /** Button type e.g. fb, twitter, reddit...etc */
    @Input() button: ShareButton;
    /** Show count, disabled by default */
    @Input() count: boolean = false;
    /** Output button count to calculate total share counts */
    @Output() countOuter = new EventEmitter<number>();

    /** Output pop up closed*/
    @Output() popUpClosed = new EventEmitter<ShareProvider>();

    /** Share count for this button */
    shareCount: number;

    constructor(private sbService: ShareButtonsService,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges) {
        /** Validate URL */
        this.url = this.sbService.validateUrl(this.url);

        if (changes['url']) {
            let currUrl = changes['url'].currentValue;
            let prevUrl = changes['url'].previousValue;

            if (currUrl && currUrl !== prevUrl) {

                /** Add share count if enabled */
                if (changes['count'] && changes['count'].currentValue) {

                    this.sbService.count(this.button.provider, this.url)
                        .subscribe(sCount => {
                            this.shareCount = sCount;
                            this.countOuter.emit(sCount);
                            this.changeDetectorRef.markForCheck();
                        });
                }
            }
        }
    }


    /** Open share window */
    share() {
        let args = new ShareArgs(this.url, this.title, this.description, this.image, this.tags);
        this.sbService.share(this.button.provider, args, this.popUpClosed);
    }
}
