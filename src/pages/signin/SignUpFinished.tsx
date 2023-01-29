import {Button} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export function SignUpFinished(){
    return (
        <div className='finish-container'>
            <div className='finish-modal'>
                <CheckCircleOutlineIcon sx={{color: '#4c8e06', fontSize: '100px'}}/>
                <h2 className='title'>가입완료</h2>
                <p className='explain'>plog 회원이 되신 것을 환영합니다!</p>
                <Button className='finish-btn' variant='contained'>로그인하러가기</Button>
            </div>

        </div>
    )
}
