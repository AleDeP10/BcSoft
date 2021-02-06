import React, { useState } from 'react';

import Dialog, {
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogButton,
    ScaleAnimation,
} from 'react-native-popup-dialog';



export default GenericDialog = (props) => {
    let handleDismiss = () => { };
    let handleCancel = () => { };
    let handleOk = () => { };
    let showCancel = true;

    if (props.onDismiss !== undefined) {
        handleDismiss = props.onDismiss;
    }
    if (props.onCancel !== undefined) {
        handleCancel = props.onCancel;
    }
    if (props.onOk !== undefined) {
        handleOk = props.onOk;
    }
    if (props.showCancel) {
        showCancel = props.showCancel;
    }

    const showCancelButton = () => {
        return (
            props.showCancel ?
                <DialogButton
                    text="CANCEL"
                    bordered
                    onPress={() => { handleCancel(); }}
                    key="cancel"
                />
            :
                <></>
        );
    };

    return (
        <Dialog
            onDismiss={() => { handleDismiss(); }}
            width={0.9}
            visible={props.showDialog}
            rounded
            actionsBordered
            dialogAnimation={new ScaleAnimation()}
            dialogTitle={
                <DialogTitle
                    title={props.title}
                    style={{
                        backgroundColor: '#F7F7F8',
                    }}
                    hasTitleBar={false}
                    align="left"
                />
            }
            footer={
                <DialogFooter>
                    {showCancelButton()}
                    <DialogButton
                        text="OK"
                        bordered
                        onPress={() => { handleOk(); }}
                        key="ok"
                    />
                </DialogFooter>
            }>
            <DialogContent style={{ backgroundColor: '#F7F7F8' }}>
                { props.children }
            </DialogContent>
        </Dialog>
    );
}