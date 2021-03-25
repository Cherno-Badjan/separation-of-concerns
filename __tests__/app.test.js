const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order')


jest.mock('../lib/utils/twilio.js');
const twilio = require('../lib/utils/twilio');

describe('endpoints', () => {
  beforeEach(() => {
    return setup(pool);
  });

  // this allows us to not create and insert a new order for each test without doing it inside the test itself. 
  let order;
  beforeEach(async() => {
    order = await Order.insert({quantity:10});

    twilio.sendSms.mockClear();

  });

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then(() => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      });
  });

//   it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
//     const res = await request(app)
//       .post('/api/v1/orders')
//       .send({ quantity: 10 });
// });


  //   expect(res.body).toEqual({
  //     id: '1',
  //     quantity: 10,
  //   });
  // });
  it('gets all orders', async () => {
    //Await promise to get the order
    const res = await request(app)
      .get('/api/v1/orders')
    //expect the body in the response to match the order created.
    expect(res.body).toEqual(
     [order]
    );
  });

  //Get by Id endpoint
  it('gets one order by id', async () => {

    const res = await request(app)
      .get(`/api/v1/orders/${order.id}`)

    expect(res.body).toEqual(
     order
    );
  });
  it('updates one order by id & sends message',() => {

    return request(app)
      .put(`/api/v1/orders/${order.id}`)
      .send({quantity: 20})
      .then(()=> {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        });

      })
  it('deletes one order by id & sends message',() => {

    return request(app)
      .delete(`/api/v1/orders/${order.id}`)
      .then(()=> {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        });

      })

  });
