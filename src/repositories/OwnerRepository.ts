// import { getRepository } from 'typeorm';
// import { Customer } from '../entities/Customer';
// import { Owner } from '../entities/Owner';

// // *New* - This is a new method that we are adding to the repository


// export const createOwner = async (name: string, email: string, password: string, phone: string) => {
//     const ownerRepository = getRepository(Owner);
//     const customer = new Owner();
//     customer.name = name;
//     customer.email = email;
//     customer.password = password;
//     customer.phone = phone;
//     await ownerRepository.save(Customer);
//     return customer;
// };

// // done
// export const getById = async (id: number) => {
//     const ownerRepository = getRepository(Owner);
//     const owner = await ownerRepository.createQueryBuilder('owner')
//         .where('owner.id = :id', { id: id })
//         .leftJoinAndSelect('owner.permissionsCategories', 'permissionsCategories')
//         .getOne();
//     return owner;
// }