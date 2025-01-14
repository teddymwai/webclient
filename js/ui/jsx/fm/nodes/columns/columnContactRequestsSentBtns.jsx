import {Button} from "../../../../buttons.jsx";
import React from "react";
import {MegaRenderMixin} from "../../../../../stores/mixins";

export class ColumnContactRequestsSentBtns extends MegaRenderMixin {
    static sortable = true;
    static id = "grid-url-header-nw";
    static label = "";
    static megatype = "grid-url-header-nw contact-controls-container";

    reinviteAllowed = rts => {
        const TIME_FRAME = 60 * 60 * 24 * 14; // 14 days in seconds
        const UTC_DATE_NOW = Math.floor(Date.now() / 1000);
        return UTC_DATE_NOW > rts + TIME_FRAME;
    };

    render() {
        let {nodeAdapter} = this.props;
        let {node} = nodeAdapter.props;

        return <td megatype={ColumnContactRequestsSentBtns.megatype} className={ColumnContactRequestsSentBtns.megatype}>
            <div className="contact-item-controls">
                {!node.dts && this.reinviteAllowed(node.rts) &&
                <Button
                    className="mega-button action"
                    icon="sprite-fm-mono icon-rewind"
                    label={l[5861]}
                    onClick={() => this.props.onReinvite(node.m)}
                />
                }
                {!node.dts &&
                    <Button
                        className="mega-button action contact-reject"
                        icon="sprite-fm-mono icon-close-component"
                        label={l[82]}
                        onClick={() => this.props.onReject(node.m)}
                    />
                }
            </div>
        </td>;
    }
}
