import axios from 'axios';

export class GetContinentService{
  async find(country: string){
    try{
      const respectiveCountry = await axios.get(`https://restcountries.com/v3.1/alpha?codes=${country}`);

      return respectiveCountry.data[0].region
    } catch(err){
      console.log(err)
    }
  }
}