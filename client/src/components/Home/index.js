import { useEffect, useContext, useState, useRef } from 'react';
import { validate } from 'rut.js';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import SocketContext from '../../context/SocketContext';
import AuthContext from '../../context/AuthContext';
import useAuth from '../../hooks/useAuth';
import Check from '../Icons/Check';
import Cross from '../Icons/Cross';
import Bell from '../Icons/Bell';
import HeartRate from '../Icons/HeartRate';
import Question from '../Icons/Question';

//Idle
//InUse
//Busy
//Unavailable
//Ringing
//InUse&Ringing
//Hold
//InUse&Hold
//Unknown
const STATES = {
  INUSE: 'InUse',
  IDLE: 'Idle',
  RINGING: 'Ringing',
  UNAVAILABLE: 'Unavailable',
};

const Home = () => {
  const [activateBreak, setActivateBreak] = useState(false);
  const [pauseType, setPauseType] = useState('default');

  const {
    register,
    errors,
    handleSubmit,
    setValue,
    reset,
    formState,
  } = useForm();

  const { isDirty } = formState;
  const toastId = useRef(null);
  const { socket } = useContext(SocketContext);
  const { token } = useContext(AuthContext);
  const { user } = useAuth();
  const [extStatus, setExtStatus] = useState(null);
  const [color, setColor] = useState('secondary');



  useEffect(() => {
    user?.ext && socket.emit('join', `SIP/${user.ext}`);
    user?.ext && socket.emit('checkExtState', user.ext);
  }, [user, socket]);

  useEffect(() => {
    console.log(activateBreak);
    if (activateBreak === false) {
      console.log('entro');
      setPauseType('default');
    }
  }, [activateBreak]);

  useEffect(() => {
    socket.on('checkedExtState', (data) => {
      setExtStatus(data);
      if (data === STATES.UNAVAILABLE) {
        setColor('danger');
      } else if (data === STATES.RINGING) {
        setColor('warning');
      } else if (data === STATES.INUSE) {
        setColor('primary');
      } else if (data === STATES.IDLE) {
        setColor('success');
      } else {
        setColor('secondary');
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('ExtStateChange', (data) => {
      setExtStatus(data);
      if (data === STATES.UNAVAILABLE) {
        setColor('danger');
      } else if (data === STATES.RINGING) {
        setColor('warning');
      } else if (data === STATES.INUSE) {
        setColor('primary');
      } else if (data === STATES.IDLE) {
        setColor('success');
      } else {
        setColor('secondary');
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('DialBegin', (data) => {
      const msg = `${data.phone} ${
        data.name === undefined ? '' : data.name?.firstName
      } ${data.name === undefined ? '' : data.name?.lastName}`;
      toastId.current = toast.dark(msg);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('BridgeEnter', (data) => {
      setValue('phone', data.phone);
      setValue('rut', data.rut);
      setValue('firstName', data.name ? data.name.firstName : '');
      setValue('lastName', data.name ? data.name.lastName : '');
      toast.dismiss(toastId.current);
    });
  }, [socket, setValue]);

  useEffect(() => {
    socket.on('Hangup', () => {
      toast.dismiss(toastId.current);
    });
  }, [socket]);

  const Icon = () => {
    switch (extStatus) {
      case STATES.UNAVAILABLE:
        return <Cross color="#ffffff" />;
      case STATES.RINGING:
        return <Bell color="#000000" />;
      case STATES.INUSE:
        return <HeartRate color="#ffffff" />;
      case STATES.IDLE:
        return <Check color="#ffffff" />;
      default:
        return <Question color="#ffffff" />;
    }
  };

  const handleOnSubmit = async (formData) => {
    try {
        const req = '/api/contacts'
        const res = await fetch(req, {
            method: 'PUT',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await res.json()
        console.log(data);
        if (!res.ok) {
          toast.error(res.error)
      }
      else{
        setValue('phone', res.phone);
        setValue('rut', res.rut);
        setValue('firstName', res.name.firstName);
        setValue('lastName', res.name.lastName);
        toast.success('Datos de contacto guardado.');
        handleReset();
      }
        return data; 
    } catch (err) {
        console.error(err)        
    }
};

  const handleReset = () => {
    reset();
  };

  const handleBreaks = (e) => {
    setPauseType(e.target.value);
  };

  const handleActivatePause = () => {
    setActivateBreak(!activateBreak);
    const data = {
      pauseType,
      activateBreak,
    };
    fetch('/api/users/break', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => {
        console.log('Success:', response);
        //if (activateBreak) setPauseType('default');
      });
  };

  return (
    <div className="py-3">
      <div className="container">
        <div className="row justify-content-center justify-content-between px-3">
          <div className="form-group m-0">
            <Button variant={color} className="mb-3 mb-sm-0" block>
              <span>{Icon()}</span> {user.name} | {user.ext}
            </Button>
          </div>
          <div className="form-group m-0">
            <div className="input-group">
              <select
                className="custom-select"
                onChange={handleBreaks}
                disabled={activateBreak}
                value={pauseType}
              >
                <option value="default">Pausas...</option>
                <option value="break">Descanso</option>
                <option value="bath">Baño</option>
                <option value="lunch">Colacion</option>
                <option value="administrative">Administrativo</option>
                <option value="supervisor">Supervisor</option>
                <option value="meeting">Reunion</option>
                <option value="maintenance">Mantencion</option>
              </select>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleActivatePause}
                  disabled={pauseType === 'default' ? true : false}
                >
                  {activateBreak ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <form onSubmit={handleSubmit(handleOnSubmit)} className="container">
        <fieldset disabled={activateBreak ? true : false}>
          <div className="form-group">
            <label htmlFor="rut">RUT</label>
            <input
              className="form-control"
              type="text"
              name="rut"
              ref={register({
                required: true,
                validate: {
                  isRut: (value) => validate(value),
                },
              })}
            />
            <small className="form-text text-muted">
              {errors.rut?.type === 'required' && 'El campo Rut es requerido.'}
              {errors.rut?.type === 'isRut' &&
                'El formato del campo Rut es invalido.'}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="firstName">Nombre</label>
            <input
              className="form-control"
              type="text"
              name="firstName"
              ref={register({ required: true, maxLength: 15, minLength: 3 })}
            />
            <small className="form-text text-muted">
              {errors.firstName?.type === 'required' &&
                'El campo Nombre  es requerido.'}
              {errors.firstName?.type === 'maxLength' &&
                'El maximo de catacteres para el campo Nombre es 15.'}
              {errors.firstName?.type === 'minLength' &&
                'El minimo de catacteres para el campo Nombre es 3.'}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Apellido</label>
            <input
              className="form-control"
              type="text"
              name="lastName"
              ref={register({ required: true, maxLength: 15, minLength: 3 })}
            />
            <small className="form-text text-muted">
              {errors.lastName?.type === 'required' &&
                'El campo Apellido es requerido.'}
              {errors.lastName?.type === 'maxLength' &&
                'El maximo de catacteres para el campo Apellido es 15.'}
              {errors.lastName?.type === 'minLength' &&
                'El minimo de catacteres para el campo Apellido es 3.'}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefono</label>
            <input
              className="form-control"
              type="text"
              name="phone"
              ref={register({ required: true, maxLength: 9, minLength: 9 })}
            />
            <small className="form-text text-muted">
              {errors.phone?.type === 'required' &&
                'El campo Telefono  es requerido.'}
              {errors.phone?.type === 'maxLength' &&
                'El maximo de catacteres para el campo Telefono es 9.'}
              {errors.phone?.type === 'minLength' &&
                'El minimo de catacteres para el campo Telefono es 9.'}
            </small>
          </div>
          <Button
            type="submit"
            variant="outline-primary"
            className="mr-2"
            //disabled={!isDirty}
          >
            Guardar
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={handleReset}
          >
            Limpiar
          </Button>
        </fieldset>
      </form>
    </div>
  );
};

export default Home;
