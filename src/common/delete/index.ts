interface IProps {
    modal: any;
    obj: object;
}

interface ReturnedValue {
    status: boolean;
}

export function deletedOne(prop: IProps): Promise<ReturnedValue> {
    return new Promise(async (resolve, reject) => {
        const { modal, obj } = prop;

        await modal.deleteOne(obj).then(() => resolve({ status: true })).catch(() => reject({ status: false }));
    });
}

export async function deletedMany(prop: IProps): Promise<ReturnedValue> {
    return new Promise(async (resolve, reject) => {
        const { modal, obj } = prop;

        await modal.deleteMany(obj).then(() => resolve({ status: true })).catch(() => reject({ status: false }));
    });
}
