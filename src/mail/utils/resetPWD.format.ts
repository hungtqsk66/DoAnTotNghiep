export const ResetPasswordHTMLBody = (userId:string,resetToken:string):string => `
<img src="https://swyx6.mjt.lu/tplimg/swyx6/b/mpyhr/hxryv.jpeg" alt="logo" width="100" height="100" style="display:block;margin:auto"/>
<h3 style="text-align: center;color:black">Chào bạn</h3>
<p style="width:500px; margin:0px auto 20px;color:black">
Chúng tôi nhận được yêu cầu của bạn về việc đặt lại mật khẩu cho tài khoản của mình<br>Nếu đó thực sự là bạn thì hãy nhấn vào nút ở phía dưới đây để tiến hành đặt lại mật khẩu
</p>
<a style="display:block;padding:10px;width:150px;text-decoration:none;text-align:center;border:2px solid black;color:black;margin:auto" href="${process.env.CLIENT_REDIRECT_URL}/resetPassWord?userId=${userId}&resetToken=${resetToken}">Đặt lại mật khẩu</a>
`;