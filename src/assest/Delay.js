import index from '../component/AccessDenied';
import styles from './index.module.css';

function Delay() {
	return (
		<div>
			<div className={styles.textwrapperw}>
				<div className={styles.titlew} data-content="404">
					! You are Offline / There is Delay in recieving / Trip has ended
				</div>
				<div className={styles.buttonsw}>
					<a className={styles.aw} href="/">
						Go to homepage
					</a>
				</div>
			</div>
		</div>
	);
}

export default Delay;
