export const fromLocality = (cf) => {
    return new Promise(resolve => {
        const localityComponent = cf.LeavingFrom.address_components.find(component => component.types.includes("locality"));
        resolve(localityComponent ? localityComponent.short_name : "");
    });
};
export  const fromLocalityKa = (cf) => {
    return new Promise(resolve => {
        const localityComponent = cf.LeavingFromKa.address_components.find(component => component.types.includes("locality"));
        resolve(localityComponent ? localityComponent.short_name : "");
    });
};
export  const fromLocalityRu = (cf) => {
    return new Promise(resolve => {
        const localityComponent = cf.LeavingFromRu.address_components.find(component => component.types.includes("locality"));
        resolve(localityComponent ? localityComponent.short_name : "");
    });
};
export  const DestionationLocality = (cf) => {
    console.log(cf.Destination,'cf.Destination')
    return new Promise(resolve => {
        const localityComponent = cf.Destination.address_components.find(component => component.types.includes("locality"));
        resolve(localityComponent ? localityComponent.short_name : "");
    });
};
export  const DestionationLocalityKa = (cf) => {
    console.log(cf.DestinationKa,'cf.DestinationKa')
    return new Promise(resolve => {
        const localityComponent = cf.DestinationKa.address_components.find(component => component.types.includes("locality"));
        resolve(localityComponent ? localityComponent.short_name : "");
    });
};
export  const DestionationLocaliRu = (cf) => {
    console.log(cf.DestinationRu,'cf.DestinationRu')
    return new Promise(resolve => {
        const localityComponent = cf.DestinationRu.address_components.find(component => component.types.includes("locality"));
        resolve(localityComponent ? localityComponent.short_name : "");
    });
};
