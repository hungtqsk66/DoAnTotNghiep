export function mapDocumentsIdToString<T = void>(arr:any):Promise<T>
{
    return new Promise((resolve,reject)=>resolve(
        arr.map(
            _element=>({
            ..._element,
            _id:_element['_id'].toString()
        }))));
}