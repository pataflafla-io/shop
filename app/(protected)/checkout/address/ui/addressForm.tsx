'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { removeUserAddress } from '@/app/actions/address/removeUserAddress';
import { setUserAddress } from '@/app/actions/address/setUserAddress';
import { Address } from '@/interfaces/address.interface';
import { Country } from '@/interfaces/country.interface';
import { useAddressStore } from '@/store/address/address.store';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

interface Props {
  countries: Country[];
  userStoredAddress?: Address;
}

type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  zipCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
};

export const AddressForm = ({ countries, userStoredAddress }: Props) => {
  // No debería de suceder ya que éste componente es usado en
  // /checkout/address/page. De todas formas, pasando required en true,
  // redireccionamos a la página de login en caso de que la
  // session esté nula, para obtener el id del usuario; necesrio
  // para el server action.
  const { data: session } = useSession({ required: true });

  const router = useRouter();

  // La dirección del usuario se persiste en el browser (zustand/localstorage).
  // Además, si el usuario tiene en checked el "remember address"; entonces,
  // la dirección persiste en la bd, en ese caso, al acceder a éste formulario,
  // defaultValues lee desde la bd para popular los campos.
  //
  // ¿Por qué hacer ésto?
  // Caso de uso 1:
  // El usuario borra el cache del browser, entonces la data ya no existe. Todos
  // sabemos que llenar un formulario no es algo que nos guste hacer.
  // Caso de uso 2:
  // El usuario está en otra máquina, por lo tanto el localstorage no tiene la
  // data del form; de nuevo, llenar formularios no es algo que nos guste hacer.
  //
  // Al final del día, se trata de mejorar la experiencia del usuario.
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      rememberAddress: false,
      ...userStoredAddress,
    },
  });

  const setAddressStore = useAddressStore((state) => state.setAddress);
  const getAddressStore = useAddressStore((state) => state.address);
  const hasHydrated = useAddressStore((state) => state._hasHydrated);

  // ¿Existe data en el localstorge?
  // La verificación evita que el defaultValues del formulario, el cual viene
  // desde el server (en caso de que haya sido guardado en la bd), sea "pisado"
  // por el objeto vacío que existe en el localStorage.
  useEffect(() => {
    const valuesFromLocalStorage = Object.values(getAddressStore).filter(
      (value) => value !== '' && value !== null && value !== undefined
    );

    if (valuesFromLocalStorage.length > 0) {
      reset(getAddressStore);
    }
  }, [hasHydrated]);

  const onSubmit = async (data: FormInputs) => {
    // Desestructuro la data del formulario ya que el schema de la bd
    // no tiene el campo rememberAddress
    const { rememberAddress, ...rest } = data;

    // Guardo el formulario en la store y lo persisto
    setAddressStore(rest);

    // En este punto, el id del user es seguro que existe
    const userId = session!.user.id;

    if (data.rememberAddress) {
      // Si el checkbox está checked; entonces, llamo al server action para impactar en
      // la bd
      await setUserAddress(rest, userId);
    } else {
      // De lo contrario, elimino la dirección de la bd si no está checked.
      // La data persiste en el localStorage del browser.
      await removeUserAddress(userId);
    }
    router.push('/checkout');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col mb-2">
        <span>Name</span>
        <input
          type="text"
          className={clsx('border-2 border-transparent p-2 rounded-md bg-gray-200', {
            'border-brand-burnt-peach': errors.firstName,
          })}
          {...register('firstName', { required: true, minLength: 3 })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Last name</span>
        <input
          type="text"
          className={clsx('border-2 border-transparent p-2 rounded-md bg-gray-200', {
            'border-brand-burnt-peach': errors.lastName,
          })}
          {...register('lastName', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Address</span>
        <input
          type="text"
          className={clsx('border-2 border-transparent p-2 rounded-md bg-gray-200', {
            'border-brand-burnt-peach': errors.address,
          })}
          {...register('address', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Address 2 (optional)</span>
        <input type="text" className="p-2 rounded-md bg-gray-200" {...register('address2')} />
      </div>

      <div className="flex flex-col mb-2">
        <span>Zip Code</span>
        <input
          type="text"
          className={clsx('border-2 border-transparent p-2 rounded-md bg-gray-200', {
            'border-brand-burnt-peach': errors.zipCode,
          })}
          {...register('zipCode', { required: true, minLength: 4 })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>City</span>
        <input
          type="text"
          className={clsx('border-2 border-transparent p-2 rounded-md bg-gray-200', {
            'border-brand-burnt-peach': errors.city,
          })}
          {...register('city', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Country</span>
        <select
          className={clsx('border-2 border-transparent p-2 rounded-md bg-gray-200', {
            'border-brand-burnt-peach': errors.country,
          })}
          {...register('country', { required: true })}
        >
          <option value="">[ Select your country ]</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <span>Phone number</span>
        <input
          type="text"
          className={clsx('border-2 border-transparent p-2 rounded-md bg-gray-200', {
            'border-brand-burnt-peach': errors.phone,
          })}
          {...register('phone', { required: true })}
        />
      </div>

      <div className="flex flex-col mb-2 sm:mt-1">
        <div className="inline-flex items-center mb-6">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-brand-burnt-peach checked:bg-brand-golden-orange checked:before:bg-brand-burnt-peach hover:before:opacity-10"
              id="checkbox"
              {...register('rememberAddress')}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
          <label htmlFor="checkbox">Do you want to remember this address?</label>
        </div>

        <button
          disabled={!isValid}
          type="submit"
          className={clsx(
            { 'btn-primary flex w-full sm:w-fit justify-center': isValid },
            { 'btn-secondary flex w-full sm:w-fit justify-center': !isValid }
          )}
        >
          Next
        </button>
      </div>
    </form>
  );
};
