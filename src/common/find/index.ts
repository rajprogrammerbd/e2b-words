interface IProps {
    modal: any;
    queryObj: any;
}

interface IResponse {
    res: any[];
}

function findValue(props: IProps): Promise<IResponse> {
    return new Promise(async (resolve, reject) => {
        const { modal, queryObj } = props;
        await modal.find(queryObj).then((arr: any[]) => {
            resolve({ res: arr });
        }).catch((err: any) => reject({ res: err }));
    });
}

export default findValue;