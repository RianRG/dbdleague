import axios from 'axios';
import url from 'url';

export class GetDiscordSession{
  async get(code: string){
    try{
      const formData = new url.URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:5000/session'
      })
  
      const output = await axios.post('https://discord.com/api/v10/oauth2/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const access = output.data.access_token
      const userInfo = await axios.get('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': `Bearer ${access}`
        }
      })
  
      const formDataForRefresh = new url.URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: output.data.refresh_token
      })
  
      const refresh = await axios.post('https://discord.com/api/v10/oauth2/token', formDataForRefresh, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
  
      return {
        user: userInfo.data,
        output: output.data,
        refresh: refresh.data
      }
    } catch(err){
      return -1;
    }
  }

  async getBySessionId(sessionId: string){
    const userInfo = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bearer ${sessionId}`
      }
    })

    return {
      user: userInfo.data
    }
  }
}